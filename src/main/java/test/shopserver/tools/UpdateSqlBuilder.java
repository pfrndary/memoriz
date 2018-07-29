package test.shopserver.tools;

import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Function;

public class UpdateSqlBuilder {

    private String tableName;
    private Collection<String> columns = new ArrayList<>();
    private Collection<String> values = new ArrayList<>();

    public UpdateSqlBuilder create(String tableName) {
        this.tableName = tableName;
        return this;
    }

    public String build() {
        final StringBuilder builder = new StringBuilder();
        builder.append("INSERT INTO ");
        builder.append(tableName);
        builder.append("(");
        StringBuilder valuesBuilder = new StringBuilder();
        for (String column : columns) {
            builder.append(column);
            builder.append(",");
            valuesBuilder.append("?");
            valuesBuilder.append(",");
        }
        builder.deleteCharAt(builder.length());
        valuesBuilder.deleteCharAt(valuesBuilder.length());
        builder.append(") VALUES (");
        builder.append(valuesBuilder.toString());
        builder.append(");");

        return builder.toString();
    }

}
