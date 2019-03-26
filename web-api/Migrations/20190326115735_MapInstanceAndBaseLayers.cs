using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class MapInstanceAndBaseLayers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Layer");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "BaseLayer",
                newName: "LayerName");

            migrationBuilder.RenameColumn(
                name: "MetadataUrl",
                table: "BaseLayer",
                newName: "AttributionUrl");

            migrationBuilder.AddColumn<string>(
                name: "Attribution",
                table: "MapInstance",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxZoom",
                table: "MapInstance",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Attribution",
                table: "BaseLayer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attribution",
                table: "MapInstance");

            migrationBuilder.DropColumn(
                name: "MaxZoom",
                table: "MapInstance");

            migrationBuilder.DropColumn(
                name: "Attribution",
                table: "BaseLayer");

            migrationBuilder.RenameColumn(
                name: "LayerName",
                table: "BaseLayer",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "AttributionUrl",
                table: "BaseLayer",
                newName: "MetadataUrl");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Layer",
                nullable: true);
        }
    }
}
