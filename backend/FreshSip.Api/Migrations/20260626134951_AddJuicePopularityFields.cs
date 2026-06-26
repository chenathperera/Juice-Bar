using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreshSip.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddJuicePopularityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMostLiked",
                table: "Juices",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LikeRate",
                table: "Juices",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMostLiked",
                table: "Juices");

            migrationBuilder.DropColumn(
                name: "LikeRate",
                table: "Juices");
        }
    }
}
