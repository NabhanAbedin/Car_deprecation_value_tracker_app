using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarDepreciationApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MarketData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    ConditionScore = table.Column<int>(type: "integer", nullable: false),
                    Mileage = table.Column<int>(type: "integer", nullable: false),
                    SoldPrice = table.Column<int>(type: "integer", precision: 18, scale: 2, nullable: false),
                    SoldDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketData", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Valuation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    InputBrand = table.Column<string>(type: "text", nullable: false),
                    InputModel = table.Column<string>(type: "text", nullable: false),
                    InputYear = table.Column<int>(type: "integer", nullable: false),
                    InputConditionScore = table.Column<int>(type: "integer", nullable: false),
                    InputMileage = table.Column<int>(type: "integer", nullable: false),
                    PredictedValue = table.Column<int>(type: "integer", nullable: false),
                    ValuationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Valuation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Valuation_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ValuationNeighbor",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ValuationId = table.Column<Guid>(type: "uuid", nullable: false),
                    MarketDataId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationNeighbor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValuationNeighbor_MarketData_MarketDataId",
                        column: x => x.MarketDataId,
                        principalTable: "MarketData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ValuationNeighbor_Valuation_ValuationId",
                        column: x => x.ValuationId,
                        principalTable: "Valuation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Valuation_UserId",
                table: "Valuation",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationNeighbor_MarketDataId",
                table: "ValuationNeighbor",
                column: "MarketDataId");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationNeighbor_ValuationId",
                table: "ValuationNeighbor",
                column: "ValuationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValuationNeighbor");

            migrationBuilder.DropTable(
                name: "MarketData");

            migrationBuilder.DropTable(
                name: "Valuation");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
