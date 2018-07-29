package test.shopserver.dao;

import test.shopserver.tools.CreationSqlBuilder;
import test.shopserver.tools.sql.Table;

public class CartIdTable {

    public static final String TABLE_NAME = "cart_id";
    public static final String ID_COLUMN_NAME = "id";
    public static final String STATUS_COLUMN_NAME = "status";

    public static final Table definition = new CreationSqlBuilder().create(TABLE_NAME) //
            .column(c -> c.name(ID_COLUMN_NAME).bigintAutoInc().notNull().primaryKey()) //
            .column(c -> c.name(STATUS_COLUMN_NAME).varchar(1).notNull()) //
            .build();

    public static String cartTableCreationScript() {
        return definition.getCreationScript(true);
    }

    public static String cartTableDropScript() {
        return definition.getDropScript();
    }

}
