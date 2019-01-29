﻿// <auto-generated />
using MapConfig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    [DbContext(typeof(MapConfigContext))]
    partial class MapConfigContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("MapConfig.Models.Filter", b =>
                {
                    b.Property<long>("FilterId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<long>("LayerId");

                    b.Property<string>("LookupSrc");

                    b.Property<string>("Name");

                    b.Property<string>("Property");

                    b.Property<string>("Type");

                    b.HasKey("FilterId");

                    b.HasIndex("LayerId");

                    b.ToTable("Filter");
                });

            modelBuilder.Entity("MapConfig.Models.Layer", b =>
                {
                    b.Property<long>("LayerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("FilterDefinition");

                    b.Property<long>("LayerGroupId");

                    b.Property<string>("Name");

                    b.Property<byte>("Opacity");

                    b.Property<long>("Order");

                    b.Property<string>("Src");

                    b.Property<string>("Type");

                    b.Property<bool>("Visible");

                    b.HasKey("LayerId");

                    b.HasIndex("LayerGroupId");

                    b.ToTable("Layer");
                });

            modelBuilder.Entity("MapConfig.Models.LayerGroup", b =>
                {
                    b.Property<long>("LayerGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<long>("MapId");

                    b.Property<string>("Name");

                    b.HasKey("LayerGroupId");

                    b.HasIndex("MapId");

                    b.ToTable("LayerGroup");
                });

            modelBuilder.Entity("MapConfig.Models.MapInstance", b =>
                {
                    b.Property<long>("MapId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("MapId");

                    b.ToTable("MapInstance");
                });

            modelBuilder.Entity("MapConfig.Models.Filter", b =>
                {
                    b.HasOne("MapConfig.Models.Layer", "Layer")
                        .WithMany("Filters")
                        .HasForeignKey("LayerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MapConfig.Models.Layer", b =>
                {
                    b.HasOne("MapConfig.Models.LayerGroup", "LayerGroup")
                        .WithMany("Layers")
                        .HasForeignKey("LayerGroupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MapConfig.Models.LayerGroup", b =>
                {
                    b.HasOne("MapConfig.Models.MapInstance", "Map")
                        .WithMany("LayerGroups")
                        .HasForeignKey("MapId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
