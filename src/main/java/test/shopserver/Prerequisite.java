package test.shopserver;

import org.h2.jdbcx.JdbcConnectionPool;
import test.shopserver.dao.CartIdTable;
import test.shopserver.dao.CartTable;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

class Prerequisite {

    Prerequisite() {
    }

    void execute() {
        final String sqlCart = CartTable.cartTableCreationScript();
        final String idTableCreationScript = CartIdTable.cartTableCreationScript();
        try {
            try (Connection connection = getConnection()) {
                PreparedStatement preparedStatement;
                preparedStatement = connection.prepareStatement(sqlCart);
                preparedStatement.execute();
                preparedStatement = connection.prepareStatement(idTableCreationScript);
                preparedStatement.execute();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Connection getConnection() throws SQLException {
        final JdbcConnectionPool cp = JdbcConnectionPool.
                create("jdbc:h2:file:~/test", "sa", "sa");
        return cp.getConnection();
    }
}
