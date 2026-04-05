using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace CarDepreciationApi.Migrations
{
    /// <inheritdoc />
    public partial class updatedtables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Vector>(
                name: "FeaturesVector",
                table: "Valuation",
                type: "vector",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeaturesVector",
                table: "Valuation");
        }
    }
}
