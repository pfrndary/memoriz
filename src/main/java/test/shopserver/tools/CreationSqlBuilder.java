package test.shopserver.tools;

import test.shopserver.tools.sql.Column;
import test.shopserver.tools.sql.ColumnBuilder;
import test.shopserver.tools.sql.Table;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

public final class CreationSqlBuilder {

    private String tableName;
    private Set<Column> columns = new HashSet<>();

    public CreationSqlBuilder create(String tableName) {
        this.tableName = tableName;
        return this;
    }

    public CreationSqlBuilder column(Function<ColumnBuilder, ColumnBuilder> function) {
        final ColumnBuilder columnBuilder = new ColumnBuilder();
        ColumnBuilder columnBuilderUpdated = function.apply(columnBuilder);
        columns.add(columnBuilderUpdated.build());
        return this;
    }

    public Table build() {
        return new Table(tableName, columns);
    }

}
