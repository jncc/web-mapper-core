using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class AllowLayerHighlight : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowLayerHighlight",
                table: "MapInstance",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowLayerHighlight",
                table: "MapInstance");
        }
    }
}
