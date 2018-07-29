package test.shopserver.dao;

import test.shopserver.tools.sql.Table;
import test.shopserver.tools.sql.WhereBuilder;

import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class CartDao {

    private Table cartDefinition;
    private AtomicLong lastCartId = new AtomicLong();
    private Map<String, Integer> cart = new ConcurrentHashMap<>();
    private List<Map<String, Integer>> previousOrders = new ArrayList<>();
    private Object latestCarts;

    public CartDao(Table cartDefinition) {
        this.cartDefinition = cartDefinition;
    }

    public long create(Connection conn) {
        previousOrders.add(cart);
        try {
            conn.prepareStatement("insert into cart_id (" + CartIdTable.STATUS_COLUMN_NAME + ") VALUES ('o');");// open
        } catch (SQLException e) {
            e.printStackTrace();
        }
        cart = new ConcurrentHashMap<>();
        return lastCartId.incrementAndGet();
    }

    /*public void update(Connection conn, long id, Map<String, Integer> articles) throws SQLException {
        Statement statement = conn.createStatement();
        for (Map.Entry<String, Integer> entry : articles.entrySet()) {
            cart.put(entry.getKey(), entry.getValue());
            final Map<String, Object> insertionValues = new HashMap<>();
            insertionValues.put(CartTable.ID_COLUMN_NAME, id);
            insertionValues.put(CartTable.ARTICLE_COLUMN_NAME, entry.getKey());
            insertionValues.put(CartTable.QTY_COLUMN_NAME, entry.getValue());
            final String script = cartDefinition.getInsertScript(insertionValues);
            statement.addBatch(script);
        }
        int[] ints = statement.executeBatch();
        System.out.println(cart);
    }*/

    public Map<String, Integer> getCartArticles(Connection conn, long idCart) throws SQLException {
        final Map<String, Integer> result = new HashMap<>();
        final WhereBuilder whereBuilder = WhereBuilder.forStatement();
        final String whereSql = whereBuilder.where(CartTable.definition.getColumnsPerName().get(CartTable.ID_COLUMN_NAME), idCart).end().toString();
        final String sql = CartTable.definition.getSelectByColsScriptForStatement(CartTable.definition.getColumns()) + " " + whereSql;
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, idCart);
            ResultSet resultSet = ps.executeQuery();
            while (resultSet.next()) {
                final String articleName = resultSet.getString(CartTable.ARTICLE_COLUMN_NAME);
                final Integer qty = resultSet.getInt(CartTable.QTY_COLUMN_NAME);
                result.put(articleName, qty);
            }
        }
        return result;
    }

    public void insert(Connection conn, long idCart, Map<String, Integer> newArticles) throws SQLException {
        final Statement statement = conn.createStatement();
        for (Map.Entry<String, Integer> entry : newArticles.entrySet()) {
            cart.put(entry.getKey(), entry.getValue());
            final Map<String, Object> insertionValues = new HashMap<>();
            insertionValues.put(CartTable.ID_COLUMN_NAME, idCart);
            insertionValues.put(CartTable.ARTICLE_COLUMN_NAME, entry.getKey());
            insertionValues.put(CartTable.QTY_COLUMN_NAME, entry.getValue());
            final String script = cartDefinition.getInsertScript(insertionValues);
            statement.addBatch(script);
        }
        statement.executeBatch();
    }

    public void update(Connection conn, long id, Map<String, Integer> articles) throws SQLException {
        final String sql = "UPDATE " + cartDefinition.getName() + " SET " + CartTable.QTY_COLUMN_NAME + " = ? WHERE " +
                CartTable.ID_COLUMN_NAME + " = ? AND " + CartTable.ARTICLE_COLUMN_NAME + " = ?;";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (Map.Entry<String, Integer> entry : articles.entrySet()) {
                ps.setLong(1, id);
                ps.setInt(2, entry.getValue());
                ps.setString(3, entry.getKey());
                final boolean updated = ps.executeUpdate() > 0;
            }
        }
        System.out.println(cart);
    }

    public Map<String, Integer> getArticles(Connection conn, long idCart) throws SQLException {
        final WhereBuilder whereBuilder = WhereBuilder.forStatement();
        final String whereSql = whereBuilder.where(CartTable.definition.getColumnsPerName().get(CartTable.ID_COLUMN_NAME), idCart).end().toString();
        final String sql = CartTable.definition.getSelectByColsScriptForStatement(CartTable.definition.getColumns()) + " " + whereSql;
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            whereBuilder.fillWithValues(ps);
            ResultSet resultSet = ps.executeQuery();
            Map<String, Integer> result = new HashMap<>();
            while (resultSet.next()) {
                final String article = resultSet.getString(CartTable.ARTICLE_COLUMN_NAME);
                final Integer qty = resultSet.getInt(CartTable.QTY_COLUMN_NAME);
                result.put(article, qty);
            }
            return Collections.unmodifiableMap(result);
        }
    }

    public Long getLatestCarts(Connection conn) throws SQLException {
        final String sql = "SELECT max(" + CartIdTable.ID_COLUMN_NAME + ") FROM " + CartIdTable.TABLE_NAME + " WHERE "+CartIdTable.STATUS_COLUMN_NAME + " = 'o';";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet resultSet = ps.executeQuery();
            if (resultSet.next()) {
                return resultSet.getLong(1);
            }
        }
        return create(conn);
    }


}
