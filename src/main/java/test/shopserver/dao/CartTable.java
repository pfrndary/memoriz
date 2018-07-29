package test.shopserver.dao;

import test.shopserver.tools.CreationSqlBuilder;
import test.shopserver.tools.sql.Table;

public class CartTable {

    public static final String TABLE_NAME = "cart";
    public static final String ID_COLUMN_NAME = "id";
    public static final String ARTICLE_COLUMN_NAME = "article";
    public static final String QTY_COLUMN_NAME = "qty";

    public static final Table definition = new CreationSqlBuilder().create(TABLE_NAME) //
            .column(c -> c.name(ID_COLUMN_NAME).bigintAutoInc().notNull().primaryKey()) //
            .column(c -> c.name(ARTICLE_COLUMN_NAME).varchar(200).notNull().primaryKey()) //
            .column(c -> c.name(QTY_COLUMN_NAME).integer().notNull()) //
            .build();

    public static String cartTableCreationScript() {
        return definition.getCreationScript(true);
    }

    public static String cartTableDropScript() {
        return definition.getDropScript();
    }
}
