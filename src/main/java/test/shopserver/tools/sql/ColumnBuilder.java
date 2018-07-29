package test.shopserver.tools.sql;

public class ColumnBuilder {
    private String name;
    private int size;
    private ColumnType type;
    private boolean notNull;
    private boolean primaryKey = false;

    public ColumnBuilder name(String name) {
        this.name = name;
        return this;
    }

    public ColumnBuilder integer() {
        this.size = 0;
        this.type = ColumnType.INTEGER;
        return this;
    }

    public ColumnBuilder bigintAutoInc() {
        this.type = ColumnType.BIGINT_AUTO_INC;
        return this;
    }

    public ColumnBuilder varchar(int size) {
        this.size = size;
        this.type = ColumnType.VARCHAR;
        return this;
    }

    public ColumnBuilder notNull() {
        this.notNull = true;
        return this;
    }

    public ColumnBuilder primaryKey() {
        this.primaryKey = true;
        return this;
    }

    public Column build() {
        return new Column(type, size, name, !notNull, primaryKey);
    }


}
