using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarDepreciationApi.Migrations
{
    /// <inheritdoc />
    public partial class updatedtablesagain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InputTransmission",
                table: "Valuation",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InputTransmission",
                table: "Valuation");
        }
    }
}
