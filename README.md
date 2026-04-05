# Car Depreciation Value Tracker

A specialized vehicle valuation engine designed for luxury car collectors. Unlike traditional calculators that use flat percentage drops, this platform utilizes a **K-Nearest Neighbors (KNN) model** to provide estimates based on historical similarity vectors.

---

## Architecture & Cloud Infrastructure

### Diagram
<img width="895" height="580" alt="Screenshot 2026-03-08 at 1 03 41 AM" src="https://github.com/user-attachments/assets/acb8e905-f76b-4e21-93dd-4e40c923c61a" />


The infrastructure is built on AWS with a focus on **cost-optimization** and **"Just-in-Time" processing**.

### Current Progress

Networking is fully configured with a VPC, three subnets, and an Internet Gateway (IGW). The database layer uses Amazon RDS (Postgres) with `pgvector` enabled for similarity searching. The backend is a C# ASP.NET Core API containerized with Docker and running on an EC2 T3.Micro instance. Python-based data cleaning and vectorization logic is also complete and ready for deployment.

### Upcoming Milestones

- [ ] **Serverless Integration** — Connect AWS Lambda to the C# backend via the AWS SDK
- [ ] **Identity Management** — Implement Amazon Cognito for secure user authentication
- [ ] **Storage & Hosting** — Provision S3 buckets for ML scalers and host the React/TypeScript frontend

---

## Architectural Trade-offs: The "Cost-First" Approach

As this is a self-funded project, the architecture prioritizes **minimizing monthly burn** over high availability.

### Low Availability & Single-AZ

To keep costs near the Free Tier, the application runs on a single EC2 instance and a Single-AZ RDS instance.

> **Trade-off:** If the specific AWS Availability Zone (AZ) goes down, the app goes down.
>
> **Justification:** For an MVP/portfolio piece, the cost of Multi-AZ deployment (2× the price) outweighs the need for 99.99% uptime.

### The "No Load Balancer" Strategy

Standard Application Load Balancers (ALB) cost ~$16–$20/month. To bypass this, the EC2 instance is placed on a **public subnet with a public IPv4**.

- **The Problem:** Exposing an EC2 instance directly to the internet is a security risk.
- **The Solution:**
  - **Custom Header Validation** — C# Middleware strictly validates a custom secret header passed by API Gateway, blocking direct-to-IP bot attacks.
  - **Security Groups** — Ingress is tightly controlled to allow traffic only from the API Gateway's CIDR range and specific administrative IPs.

---

## Technical Stack

| Layer | Technologies |
|---|---|
| **Backend** | C# 12, ASP.NET Core, Entity Framework Core, Pgvector |
| **ML Pipeline** | Python, Scikit-Learn (MinMaxScaler, KNN), Pandas |
| **DevOps** | Docker, AWS |
| **Frontend** | React, TypeScript, Tailwind CSS, TanStack Query |

---

## Security Implementation

Because the EC2 instance sits on a public subnet (to avoid NAT Gateway costs), security is enforced at the application level:

1. **API Gateway as a Shield** — Acts as the sole entry point, handling CORS and throttling.
2. **Custom Middleware** — All incoming requests to the EC2 instance must pass a header check. Requests missing or presenting an incorrect header are dropped before reaching any controller logic.
3. **RDS Isolation** — The RDS instance lives on a private subnet and only accepts connections originating from the EC2 instance's Security Group.

---

## Similarity Search: Process & Implementation

The core engine uses a **high-dimensional similarity search** to identify "Real World Twins" for any vehicle — grounding valuations in actual historical sales rather than generic depreciation formulas.

### Data Analysis & Feature Exclusion

- **Logical Partitioning** — `Brand` and `Model` are excluded from vectorization to prevent artificial mathematical relationships between distinct manufacturers. These fields act as strict SQL filters, ensuring a vehicle is only compared against exact matches.
- **Feature Selection** — Only continuous numerical data — `Age`, `Kilometers`, and `Condition` — are passed to the scaler. This preserves the distance calculation's sensitivity to the primary drivers of vehicle value.

### The Vector Search Cycle & HNSW Implementation

The valuation follows a coordinated execution cycle between the C# API, Python Lambda, and the RDS instance:
```
User Input → API Gateway → C# API → Python Lambda (Vectorize) → pgvector HNSW Search → Weighted Average → Valuation
```

1. **On-the-Fly Vectorization** — The C# backend invokes a Python Lambda that retrieves a trained scaler from S3, transforming raw user inputs into a normalized feature vector.
2. **HNSW Search** — The `FeaturesVector` column is indexed using **HNSW (Hierarchical Navigable Small Worlds)**, enabling rapid graph-based retrieval in logarithmic time.
3. **Distance Calculation** — The system uses `pgvector`'s Euclidean distance operator (`<->`) to traverse the HNSW graph and measure the mathematical gap between the query vector and stored records.
4. **Neighbor Identification** — The database returns the most similar records within the filtered `Brand` and `Model` scope. The final valuation is the **weighted average of `SoldPrice`** across these neighbors.
