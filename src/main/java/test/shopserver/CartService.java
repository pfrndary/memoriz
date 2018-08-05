package test.shopserver;

import org.h2.jdbcx.JdbcConnectionPool;
import test.shopserver.dao.CartDao;
import test.shopserver.dao.CartTable;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class CartService {


    private CartDao cartDao = new CartDao(CartTable.definition);

    CartService() {
    }

    public Long create() throws SQLException {
        try (Connection conn = getConnection()) {
            return cartDao.create(conn);
        }
    }

    void addOrUpdateArticles(long idCart, Map<String, Integer> newValuesArticles) throws SQLException {
        try (Connection conn = getConnection()) {
            final Map<String, Integer> existingArticlesInCart = cartDao.getCartArticles(conn, idCart);
            final Map<String, Integer> newArticles = new HashMap<>();
            final Map<String, Integer> articlesToUpdate = new HashMap<>();

            for (Map.Entry<String, Integer> entry : newValuesArticles.entrySet()) {
                final Integer qty = existingArticlesInCart.get(entry.getKey());
                if (qty == null) {
                    newArticles.put(entry.getKey(), entry.getValue());
                } else if (!entry.getValue().equals(qty)) {
                    articlesToUpdate.put(entry.getKey(), entry.getValue());
                }
            }
            cartDao.update(conn, idCart, articlesToUpdate);
            cartDao.insert(conn, idCart, newArticles);
        }
    }

    Map<String, Integer> getArticles(long idCart) throws SQLException {
        try (Connection connection = getConnection()) {
            return cartDao.getArticles(connection, idCart);
        }
    }

    Long getLatestCarts() throws SQLException {
        try (Connection conn = getConnection()) {
            return cartDao.getLatestCarts(conn);
        }
    }

    private Connection getConnection() throws SQLException {
        final JdbcConnectionPool cp = JdbcConnectionPool.
                create("jdbc:h2:~/test", "sa", "sa");
        return cp.getConnection();
    }
}
