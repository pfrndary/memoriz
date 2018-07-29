package test.shopserver;

import org.h2.jdbcx.JdbcConnectionPool;
import test.shopserver.dao.CartIdTable;
import test.shopserver.dao.CartTable;
import test.shopserver.tools.CreationSqlBuilder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Prerequisite {


    public Prerequisite() {
    }

    public void execute() {
        // final String sqlCart = cartTableCreationScript(new CreationSqlBuilder());
        final String sqlDropCart = CartTable.cartTableDropScript();
        final String sqlCart = CartTable.cartTableCreationScript();
       // final String idTableDeleteScript = CartIdTable.cartTableDropScript();
        final String idTableCreationScript = CartIdTable.cartTableCreationScript();//cartIdTableCreationScript(new CreationSqlBuilder());
        try {
            try (Connection connection = getConnection()) {
               // PreparedStatement ps = connection.prepareStatement(idTableDeleteScript);
                //ps.execute();
                PreparedStatement preparedStatement = connection.prepareStatement(sqlDropCart);
                preparedStatement.execute();
                preparedStatement = connection.prepareStatement(sqlCart);
                preparedStatement.execute();
                preparedStatement = connection.prepareStatement(idTableCreationScript);
                preparedStatement.execute();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Deprecated // preferer une classe dediee a la table
    private String cartIdTableCreationScript(CreationSqlBuilder builder) {
        return builder.create("cart_id") //
                .column(c -> c.name("id").bigintAutoInc().notNull()) //
                .build().getCreationScript(true);
    }

    @Deprecated // preferer une classe dediee a la table
    private String cartTableCreationScript(CreationSqlBuilder builder) {
        return builder.create("cart") //
                .column(c -> c.name("id").integer().notNull().primaryKey()) //
                .column(c -> c.name("article").varchar(200).notNull().primaryKey()) //
                .column(c -> c.name("qty").integer().notNull()) //
                .build().getCreationScript(true);
    }

    private Connection getConnection() throws SQLException {
        final JdbcConnectionPool cp = JdbcConnectionPool.
                create("jdbc:h2:~/test", "sa", "sa");
        return cp.getConnection();
    }
}
