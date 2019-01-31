using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class ModifyBaseLayerVisibility : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Visible",
                table: "BaseLayer");

            migrationBuilder.AddColumn<string>(
                name: "VisibleBaseLayer",
                table: "MapInstance",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VisibleBaseLayer",
                table: "MapInstance");

            migrationBuilder.AddColumn<bool>(
                name: "Visible",
                table: "BaseLayer",
                nullable: false,
                defaultValue: false);
        }
    }
}
