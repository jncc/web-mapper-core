using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class MapAndLayerFieldNames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Zoom",
                table: "MapInstance",
                newName: "MapZoom");

            migrationBuilder.RenameColumn(
                name: "Centre",
                table: "MapInstance",
                newName: "MapCentre");

            migrationBuilder.RenameColumn(
                name: "Zoom",
                table: "Layer",
                newName: "LayerZoom");

            migrationBuilder.RenameColumn(
                name: "Visible",
                table: "Layer",
                newName: "LayerVisible");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "Layer",
                newName: "LayerOrder");

            migrationBuilder.RenameColumn(
                name: "Opacity",
                table: "Layer",
                newName: "LayerOpacity");

            migrationBuilder.RenameColumn(
                name: "Centre",
                table: "Layer",
                newName: "LayerCentre");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MapZoom",
                table: "MapInstance",
                newName: "Zoom");

            migrationBuilder.RenameColumn(
                name: "MapCentre",
                table: "MapInstance",
                newName: "Centre");

            migrationBuilder.RenameColumn(
                name: "LayerZoom",
                table: "Layer",
                newName: "Zoom");

            migrationBuilder.RenameColumn(
                name: "LayerVisible",
                table: "Layer",
                newName: "Visible");

            migrationBuilder.RenameColumn(
                name: "LayerOrder",
                table: "Layer",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "LayerOpacity",
                table: "Layer",
                newName: "Opacity");

            migrationBuilder.RenameColumn(
                name: "LayerCentre",
                table: "Layer",
                newName: "Centre");
        }
    }
}
