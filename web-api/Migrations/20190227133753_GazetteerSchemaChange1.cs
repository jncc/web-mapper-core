using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class GazetteerSchemaChange1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Zoom",
                table: "Gazetteer");

            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "Gazetteer",
                newName: "Ymin");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "Gazetteer",
                newName: "Ymax");

            migrationBuilder.AddColumn<bool>(
                name: "Imported",
                table: "Gazetteer",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "Xmax",
                table: "Gazetteer",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Xmin",
                table: "Gazetteer",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Imported",
                table: "Gazetteer");

            migrationBuilder.DropColumn(
                name: "Xmax",
                table: "Gazetteer");

            migrationBuilder.DropColumn(
                name: "Xmin",
                table: "Gazetteer");

            migrationBuilder.RenameColumn(
                name: "Ymin",
                table: "Gazetteer",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "Ymax",
                table: "Gazetteer",
                newName: "Latitude");

            migrationBuilder.AddColumn<int>(
                name: "Zoom",
                table: "Gazetteer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
