package test.shopserver.tools.sql;

import java.util.*;

public final class Table {
    private final String name;
    private final Set<Column> columns;
    private final Map<String, Column> columnsPerName;

    public Table(String name, Set<Column> columns) {
        this.name = name;
        this.columns = Collections.unmodifiableSet(columns);
        this.columnsPerName = new HashMap<>();
        for (Column column : columns) {
            columnsPerName.put(column.getName(), column);
        }
    }

    public String getDropScript() {
        return "DROP TABLE " + name + ";";
    }

    public String getCreationScript(boolean ifNotExist) {
        final StringBuilder builder = new StringBuilder();
        builder.append("CREATE TABLE ");
        if (ifNotExist) {
            builder.append("IF NOT EXISTS ");
        }
        builder.append(name);
        builder.append("(");
        final Set<String> primaryKeys = new HashSet<>();
        for (Column column : columns) {
            builder.append(column.getDeclarationForDeclaration());
            primaryKeys.add(column.getName());
            builder.append(",");
        }
        if (primaryKeys.size() > 0) {
            builder.append("PRIMARY KEY ( ");
            for (String primaryKey : primaryKeys) {
                builder.append(primaryKey);
                builder.append(",");
            }
            builder.deleteCharAt(builder.length() - 1);
            builder.append(")");
        }
        builder.append(");");
        return builder.toString();
    }

    public String getSelectByColsScriptForStatement(Set<Column> conditionCols) {
        final StringBuilder builder = new StringBuilder();
        builder.append("SELECT ");
        for (Column column : columns) {
            builder.append(name);
            builder.append(".");
            builder.append(column.getName());
            builder.append(",");
        }
        builder.deleteCharAt(builder.length() - 1);
        builder.append(" FROM ");
        builder.append(name);
        /*builder.append(" WHERE ");
        for (Column conditionCol : conditionCols) {
            builder.append(conditionCol.getName());
            builder.append(" = ? ");
        }*/
        return builder.toString();
    }

    // TODO insertion de code malicieux possible
    public String getInsertScript(Map<String, Object> valuesPerColumn) {
        final StringBuilder builder = new StringBuilder();
        builder.append("INSERT INTO ");
        builder.append(name);
        builder.append(" (");
        final StringBuilder values = new StringBuilder();
        values.append(" VALUES (");
        for (Map.Entry<String, Object> entry : valuesPerColumn.entrySet()) {
            final Column column = columnsPerName.get(entry.getKey());
            final String value = column.getColumnType().format(entry.getValue().toString());
            builder.append(column.getName());
            builder.append(",");
            values.append(value);
            values.append(",");
        }
        builder.deleteCharAt(builder.length() - 1);
        values.deleteCharAt(values.length() - 1);
        builder.append(")");
        values.append(")");
        builder.append(values);
        // TODO on duplicate key update
        /*builder.append(" ON DUPLICATE KEY UPDATE ");
        for (Map.Entry<String, Object> entry : valuesPerColumn.entrySet()) {
            final Column column = columnsPerName.get(entry.getKey());
            final String value = column.getColumnType().format(entry.getValue().toString());
            builder.append(column.getName());
            builder.append("=");
            builder.append("VALUES(");
            builder.append(column.getName());
            builder.append(")");
            builder.append(",");
        }
        builder.deleteCharAt(builder.length() - 1);*/
        builder.append(";");
        return builder.toString();
    }


    // TODO insertion de code malicieux possible
    public String getUpdateScript(Map<String, Object> newValues, Map<String, Object> whereConditions) {
        final StringBuilder builder = new StringBuilder();
        builder.append("UPDATE ");
        builder.append(name);
        builder.append(" SET ");
        for (Map.Entry<String, Object> entry : newValues.entrySet()) {
            final Column column = columnsPerName.get(entry.getKey());
            builder.append(column.getName());
            builder.append(" = ");
            builder.append(column.getColumnType().format(entry.getValue().toString())); // TODO et si c'est null ??
            builder.append(" ");
        }
        builder.append(" WHERE ");
        for (Map.Entry<String, Object> entry : whereConditions.entrySet()) {
            final Column column = columnsPerName.get(entry.getKey());
            builder.append(column.getName());
            builder.append(" = ");
            builder.append(column.getColumnType().format(entry.getValue().toString())); // TODO et si c'est null ??
            builder.append(" ");
        }
        builder.append(";");
        return builder.toString();
    }

    public String getName() {
        return name;
    }

    public Set<Column> getColumns() {
        return columns;
    }

    public Map<String, Column> getColumnsPerName() {
        return columnsPerName;
    }
}
