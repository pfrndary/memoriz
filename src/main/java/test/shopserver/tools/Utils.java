package test.shopserver.tools;

public class Utils {

    public static String join(String separator, String... values) {
        final StringBuilder builder = new StringBuilder();
        for (String value : values) {
            builder.append(value);
            builder.append(separator);
        }
        builder.delete(builder.length() - separator.length(), builder.length());
        return builder.toString();
    }

}
