package test.shopserver.tools.sql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public enum ColumnType {
    VARCHAR, INTEGER, BIGINT, BIGINT_AUTO_INC;

    public String getDeclaration() {
        if (BIGINT_AUTO_INC.equals(this)) {
            return "BIGINT auto_increment";
        }
        return this.toString();
    }

    public void setValue(PreparedStatement ps, int i, Object value) throws SQLException {
        switch (this) {
            case VARCHAR:
                ps.setString(i, value.toString());
                break;
            case INTEGER:
                ps.setInt(i, (Integer) value);
                break;
            case BIGINT:
            case BIGINT_AUTO_INC:
                ps.setLong(i, (Long) value);
                break;
        }
    }

    public Object getValue(ResultSet rs, String name) throws SQLException {
        switch (this) {
            case VARCHAR:
                return rs.getString(name);
            case INTEGER:
                return rs.getInt(name);
            case BIGINT:
            case BIGINT_AUTO_INC:
                return rs.getLong(name);
        }
        return null;
    }

    public String format(String value) {
        if (this.equals(VARCHAR)) {
            return String.format("'%s'", value);
        }
        return value;
    }
}
