# Car Depreciation Value Tracker

A precision valuation engine tailored for luxury car collectors. Unlike standard linear age-based formulas, this platform utilizes a K-Nearest Neighbors (KNN) model to estimate vehicle values by identifying historical similarity vectors within a curated dataset of high-end automotive sales.

This project serves as a comprehensive showcase of modern cloud architecture, prioritizing cost-efficiency and security for a demonstration deployment scenario.

---

## Tech Stack & Technologies Used

### Core Frameworks
- **Backend**: C# ASP.NET Core (Web APIs) – Orchestrates the business logic and service communication
- **Frontend**: React with TypeScript – Utilizing TanStack Query for efficient data fetching and React Router for navigation
- **Machine Learning**: Python – Using Scikit-learn for KNN training/analysis and Pandas for data cleaning
- **Styling**: Tailwind CSS with Framer Motion for polished UI/UX transitions

### Cloud Infrastructure (AWS)
- **Compute**: EC2 (t3.micro), Lambda (Serverless Python functions)
- **Storage**: Amazon RDS (PostgreSQL), Amazon S3 (Frontend hosting and image storage)
- **Gateway & Auth**: Amazon API Gateway, Amazon Cognito
- **Networking**: VPC, IAM Roles, Internet Gateway (IGW)

### DevOps & Tools
- **Containerization**: Docker (Multi-arch builds for AMD64 compatibility)
- **Database**: PostgreSQL

---

## 1. Cloud Architecture: Decisions & Tradeoffs

The infrastructure is built on AWS with a focus on balancing a "student budget" with production-grade security patterns.

### Diagram
<img width="885" height="566" alt="Screenshot 2026-02-01 at 10 03 06 PM" src="https://github.com/user-attachments/assets/7397ec6c-39dd-4182-9d23-73e9241d161b" />


### Networking & Connectivity

#### 3-Subnet VPC Geometry
**Decision**: I implemented a 3-subnet geometry but placed the EC2 and RDS instances in a single Availability Zone (`us-east-1a`).
- **Tradeoff**: There is no failover. If the specific AWS data center (AZ) experiences an outage, the application goes down.
- **The "9-Subnet" Alternative**: In a production environment, I would deploy a 6 or 9-subnet architecture across 3 AZs. This would involve an Application Load Balancer (ALB) in the public subnets, an ECS Fargate Cluster across private subnets, and an RDS Multi-AZ deployment with standby replicas.
- **Why Single-AZ?** Cost. A Multi-AZ RDS instance and the necessary NAT Gateways required for private-subnet ECS scaling can cost upwards of $60+/month. For a showcase project, I chose zero-cost resilience.

#### The "ALB-less" Gateway
- **Decision**: To avoid the fixed hourly cost of an Application Load Balancer (ALB), the EC2 instance resides in a public subnet. I use an AWS HTTP API Gateway as the entry point.
- **Tradeoff**: To secure the "exposed" EC2 instance, I use a Secret Header Middleware. The API Gateway injects a unique key into every request; the C# server drops any traffic lacking this header, effectively creating a "virtual firewall" without the cost of a load balancer.

### Compute & Storage

#### Burstable Performance (t3/t4g)
- **Decision**: Leveraging t3.micro for EC2 and db.t4g.micro for RDS.
- **Tradeoff**: These rely on CPU credits. While they could throttle under sustained heavy training, they are ideal for a showcase app where usage comes in short bursts during a demonstration.

#### Storage Strategy (gp3 vs. gp2)
- **Decision**: Used gp3 for EBS (EC2) and gp2 for RDS.
- **Tradeoff**: gp3 is 20% cheaper and allows independent scaling of IOPS. However, for RDS, gp2 is the standard for the AWS Free Tier, ensuring the database costs remain at zero.

---

## 2. Machine Learning: K-Nearest Neighbors (KNN)

The core valuation logic is a Non-Parametric KNN Regression model.

### Why KNN for Luxury Cars?

Standard linear regression assumes a constant rate of depreciation ($y = mx + b$). Luxury cars don't follow this; a 1960s Porsche might appreciate, while a 2020 model drops 20% in a year.

- **Feature Vector**: The model treats each car as a coordinate in a multi-dimensional space based on Year, Mileage, and Condition Score.
- **Similarity Logic**: When a user inputs their car, the model calculates the "distance" to historical sales. It finds the K closest matches and averages their price.
- **Transparency**: Unlike "black box" models, KNN allows the UI to show the user the 3–5 specific cars used to calculate the value, providing concrete evidence for the estimate.

### The Data Pipeline

- **Vectorization**: Non-numeric data (Make/Model) is transformed into numerical vectors using Scikit-learn.
- **Inference via Lambda**: To keep the C# backend "lean," the actual math is offloaded to a Python Lambda.
- **Tradeoff (Cold Starts)**: The first valuation might take 1–2 seconds to initialize the Lambda, but this modularity allows the C# server to remain focused on API orchestration rather than heavy mathematical processing.

---

## 3. Security & Authentication

### Identity Management

- **Amazon Cognito**: I integrated Cognito for user identity. The React frontend interacts directly with Cognito to receive a JWT (JSON Web Token).
- **Protected Routes**: The API Gateway acts as a gatekeeper, verifying the JWT before the request ever reaches the EC2 instance. This offloads the security overhead from my application code.

### Resource Security

- **IAM Roles**: The EC2 instance and Lambda use IAM Execution Roles to interact with S3 and RDS. No hardcoded AWS Access Keys exist within the codebase.
- **S3 Image Storage**: Images are stored in a private S3 bucket. To display them, the backend generates Presigned URLs, allowing the user's browser to download images directly from S3. This saves EC2 bandwidth and keeps the storage private.

---

## 4. Current Progress & To-Do

- [x] Custom VPC with 3-Subnet Architecture
- [x] EC2 Instance with Dockerized .NET Core API
- [x] RDS PostgreSQL Instance (Private Subnet)
- [x] API Gateway Connectivity
- [ ] **In Progress**: Cognito Authentication Integration
- [ ] **In Progress**: Python KNN Lambda Function
- [ ] **In Progress**: S3 Bucket for Frontend Hosting & Image Storage

---


