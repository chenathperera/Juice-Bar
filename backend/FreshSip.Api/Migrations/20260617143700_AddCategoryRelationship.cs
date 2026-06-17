using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreshSip.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.Sql("""
                INSERT INTO Categories (Name, Description)
                SELECT DISTINCT LTRIM(RTRIM(Category)), NULL
                FROM Juices
                WHERE Category IS NOT NULL AND LTRIM(RTRIM(Category)) <> ''
                """);

            migrationBuilder.Sql("""
                IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Uncategorized')
                BEGIN
                    INSERT INTO Categories (Name, Description)
                    VALUES ('Uncategorized', 'Default category for existing juices without a category name.')
                END
                """);

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Juices",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE j
                SET j.CategoryId = c.Id
                FROM Juices j
                INNER JOIN Categories c ON c.Name = LTRIM(RTRIM(j.Category))
                """);

            migrationBuilder.Sql("""
                UPDATE Juices
                SET CategoryId = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Uncategorized')
                WHERE CategoryId IS NULL
                """);

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Juices",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Juices_CategoryId",
                table: "Juices",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Juices_Categories_CategoryId",
                table: "Juices",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Juices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Juices",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE j
                SET j.Category = c.Name
                FROM Juices j
                INNER JOIN Categories c ON c.Id = j.CategoryId
                """);

            migrationBuilder.DropForeignKey(
                name: "FK_Juices_Categories_CategoryId",
                table: "Juices");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Juices_CategoryId",
                table: "Juices");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Juices");
        }
    }
}
