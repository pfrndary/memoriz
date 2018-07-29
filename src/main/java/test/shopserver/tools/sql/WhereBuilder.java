package test.shopserver.tools.sql;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public final class WhereBuilder {

    private final StringBuilder builder = new StringBuilder();
    private List<ColumnValue> columnsToFill = new ArrayList<>();

    private boolean forStatement;

    @Override
    public String toString() {
        return builder.toString();
    }

    private WhereBuilder(boolean forStatement) {
        this.forStatement = forStatement;
    }

    public static WhereBuilder forStatement() {
        return new WhereBuilder(true);
    }

    public ColumnForPsWhereBuilder where(Column c, Object v) {
        return new ColumnForPsWhereBuilder(this, c, v);
    }

    public void fillWithValues(PreparedStatement ps) throws SQLException {
        int i = 1;
        for (ColumnValue columnValue : columnsToFill) {
            if (columnValue.isSingleValue()) {
                columnValue.column.getColumnType().setValue(ps, i++, columnValue.value);
            } else {
                for (Object value : columnValue.values) {
                    columnValue.column.getColumnType().setValue(ps, i++, value);
                }
            }
        }
    }

    public static class ColumnForPsWhereBuilder {
        private StringBuilder builder = new StringBuilder();
        private List<ColumnValue> valuesPerColumns = new ArrayList<>();
        private WhereBuilder wb;

        public ColumnForPsWhereBuilder(WhereBuilder wb, Column c, Object v) {
            this.wb = wb;
            builder.append(" WHERE ");
            builder.append(c.getName());
            builder.append(" = ? ");
            valuesPerColumns.add(new ColumnValue(c, v));
        }

        public ColumnForPsWhereBuilder and(Column c, Object v) {
            builder.append(" AND ");
            builder.append(c.getName());
            builder.append(" = ? ");
            valuesPerColumns.add(new ColumnValue(c, v));
            return this;
        }

        public ColumnForPsWhereBuilder or(Column c, Object v) {
            builder.append(" AND ");
            builder.append(c.getName());
            builder.append(" = ? ");
            valuesPerColumns.add(new ColumnValue(c, v));
            return this;
        }

        public ColumnForPsWhereBuilder in(int nParam, Column c, Collection<Object> os) {
            builder.append(" IN (");
            for (int i = 0; i < nParam; i++) {
                builder.append("?, ");
            }
            builder.deleteCharAt(builder.length() - 1);
            builder.append(")");
            valuesPerColumns.add(new ColumnValue(c, os));
            return this;
        }

        public WhereBuilder end() {
            wb.builder.append(builder);
            wb.columnsToFill.addAll(valuesPerColumns);
            return wb;
        }
    }

    private static class ColumnValue {
        private final Column column;
        private final Object value;
        private final Collection<Object> values;

        private ColumnValue(Column column, Object value) {
            this.column = column;
            this.value = value;
            this.values = Collections.emptyList();
        }

        private ColumnValue(Column column, Collection<Object> values) {
            this.column = column;
            this.value = null;
            this.values = values;
        }

        public boolean isSingleValue() {
            return values.isEmpty();
        }
    }

}
