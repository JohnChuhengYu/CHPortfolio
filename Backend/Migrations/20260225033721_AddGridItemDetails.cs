using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddGridItemDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProblemDescription",
                table: "GridItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SolutionDescription",
                table: "GridItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubTitle",
                table: "GridItems",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Tags",
                table: "GridItems",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProblemDescription",
                table: "GridItems");

            migrationBuilder.DropColumn(
                name: "SolutionDescription",
                table: "GridItems");

            migrationBuilder.DropColumn(
                name: "SubTitle",
                table: "GridItems");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "GridItems");
        }
    }
}
