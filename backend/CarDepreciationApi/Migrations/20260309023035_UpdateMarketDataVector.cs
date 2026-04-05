using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace CarDepreciationApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMarketDataVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoldDate",
                table: "MarketData");

            migrationBuilder.RenameColumn(
                name: "InputMileage",
                table: "Valuation",
                newName: "InputKilometers");

            migrationBuilder.RenameColumn(
                name: "Mileage",
                table: "MarketData",
                newName: "Kilometers");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.AddColumn<string>(
                name: "InputFuelType",
                table: "Valuation",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Img",
                table: "MarketData",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "MarketData",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "MarketData",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Vector>(
                name: "FeaturesVector",
                table: "MarketData",
                type: "vector(8)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FuelType",
                table: "MarketData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "MarketData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Transmission",
                table: "MarketData",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MarketData_FeaturesVector",
                table: "MarketData",
                column: "FeaturesVector")
                .Annotation("Npgsql:IndexMethod", "hnsw")
                .Annotation("Npgsql:IndexOperators", new[] { "vector_l2_ops" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MarketData_FeaturesVector",
                table: "MarketData");

            migrationBuilder.DropColumn(
                name: "InputFuelType",
                table: "Valuation");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "MarketData");

            migrationBuilder.DropColumn(
                name: "FeaturesVector",
                table: "MarketData");

            migrationBuilder.DropColumn(
                name: "FuelType",
                table: "MarketData");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "MarketData");

            migrationBuilder.DropColumn(
                name: "Transmission",
                table: "MarketData");

            migrationBuilder.RenameColumn(
                name: "InputKilometers",
                table: "Valuation",
                newName: "InputMileage");

            migrationBuilder.RenameColumn(
                name: "Kilometers",
                table: "MarketData",
                newName: "Mileage");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.AlterColumn<string>(
                name: "Img",
                table: "MarketData",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "MarketData",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AddColumn<DateTime>(
                name: "SoldDate",
                table: "MarketData",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
