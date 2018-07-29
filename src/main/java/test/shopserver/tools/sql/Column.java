package test.shopserver.tools.sql;

public class Column {

    private final ColumnType columnType;
    private final int parameter;
    private final String name;
    private final boolean nullable;
    private final boolean primaryKey;

    public Column(ColumnType columnType, int parameter, String name, boolean nullable, boolean primaryKey) {
        this.columnType = columnType;
        this.parameter = parameter;
        this.name = name;
        this.nullable = nullable;
        this.primaryKey = primaryKey;
    }

    public String getDeclarationForDeclaration() {
        String typeParameter = "";
        if (parameter > 0) {
            typeParameter = "(" + parameter + ")";
        }
        return name + " " + columnType.getDeclaration() + typeParameter + (nullable ? "" : " NOT") + " NULL";
    }

    public ColumnType getColumnType() {
        return columnType;
    }

    public int getParameter() {
        return parameter;
    }

    public String getName() {
        return name;
    }

    public boolean isNullable() {
        return nullable;
    }

    public boolean isPrimaryKey() {
        return primaryKey;
    }
}

