package test.shopserver;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.StaticHandler;
import test.shopserver.tools.mail.GMailSender;

import javax.mail.MessagingException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class ShopVerticle extends AbstractVerticle {

    private final String MAIL_CONFIG = "./src/main/resources/mail-config.properties";

    private CartService cartService;
    private GMailSender gMailSender;
    private String senderEmail;
    private Set<String> receiversEmail;

    ShopVerticle() {
        cartService = new CartService();
        final Prerequisite prerequisite = new Prerequisite();
        prerequisite.execute();

        final Properties properties = new Properties();
        final InputStream input;
        try {
            final File f = new File(MAIL_CONFIG);
            System.out.println(f.getAbsolutePath());
            input = new FileInputStream(MAIL_CONFIG);
            properties.load(input);
            senderEmail = properties.getProperty("sender");
            receiversEmail = new HashSet<>();
            int i = 1;
            String value;
            while ((value = properties.getProperty("receiver." + i)) != null) {
                receiversEmail.add(value);
                i++;
            }
            gMailSender = new GMailSender(senderEmail);
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(-1);
        }
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        super.start(startFuture);
        gMailSender.initialize();
        Router router = Router.router(vertx);
        router.get("/api/articles").handler(this::getAllArticles);
        router.get("/api/carts").handler(this::getLatestCart);
        router.post("/api/carts").handler(this::createCart);
        router.post("/api/carts/:id/send").handler(this::sendCart);
        router.get("/api/carts/:id").handler(this::getArticles);
        router.post("/api/carts/:id").handler(this::updateCart);
        // router.post("/api/carts/:id/articles").handler(this::fillCart);
        router.route("/js/*").handler(StaticHandler.create("html/js"));
        router.route("/style/*").handler(StaticHandler.create("html/style"));
        router.route("/index").handler(StaticHandler.create("html/textassist.html"));
        vertx
                .createHttpServer()
                .requestHandler(router::accept)
                .listen(
                        // Retrieve the port from the configuration,
                        // default to 8080.
                        config().getInteger("http.port", 8080),
                        result -> {
                            if (result.succeeded()) {
                                //startFuture.complete();
                            } else {
                                startFuture.fail(result.cause());
                            }
                        }
                );
    }

    private void sendCart(RoutingContext routingContext) {
        final String id = routingContext.request().getParam("id");
        routingContext.request().bodyHandler(bodyHandler -> {
            try {
                final Map<String, Integer> articles = cartService.getArticles(Long.parseLong(id));
                cartService.freezeCart(Long.parseLong(id));
                final DateFormat format = new SimpleDateFormat("dd/MM/yyyy");
                final StringBuilder builder = new StringBuilder();
                for (Map.Entry<String, Integer> entry : articles.entrySet()) {
                    builder.append(entry.getKey());
                    builder.append(" : ");
                    builder.append(entry.getValue());
                    builder.append("\n");
                }
                final String strCart = builder.toString();
                gMailSender.send(receiversEmail, "Courses " + format.format(Calendar.getInstance().getTime()), strCart);
                routingContext.response().setStatusCode(200).end();
            } catch (SQLException | MessagingException | IOException e) {
                routingContext.response().setStatusCode(500).setStatusMessage(e.getMessage()).end();
            }
        });
    }

    private void getArticles(RoutingContext routingContext) {
        final String id = routingContext.request().getParam("id");
        try {
            final Map<String, Integer> articles = cartService.getArticles(Long.parseLong(id));
            routingContext.response()
                    .putHeader("content-type", "application/json; charset=utf-8")
                    .end(Json.encodePrettily(articles));
        } catch (SQLException e) {
            routingContext.response().setStatusCode(500).setStatusMessage(e.getMessage()).end();
        }
    }

    private void updateCart(RoutingContext routingContext) {
        routingContext.request().bodyHandler(bodyHandler -> {
            String id = routingContext.request().getParam("id");
            JsonArray data = bodyHandler.toJsonArray();
            try {
                Map<String, Integer> newCartData = new HashMap<>();
                for (Object datum : data) {
                    final JsonObject jsonObject = (JsonObject) datum;
                    newCartData.put(jsonObject.getString("name"), jsonObject.getInteger("qty"));
                }
                cartService.addOrUpdateArticles(Long.parseLong(id), newCartData);
                routingContext.response().setStatusCode(200).end();
            } catch (SQLException e) {
                routingContext.response().setStatusCode(500).setStatusMessage(e.getMessage()).end();
            }
        });
    }

    private void createCart(RoutingContext routingContext) {
        final Long cartId;
        try {
            cartId = cartService.create();
            routingContext.response()
                    .putHeader("content-type", "application/json; charset=utf-8")
                    .end(Json.encodePrettily(Collections.singletonMap("id", cartId)));
        } catch (SQLException e) {
            routingContext.response().setStatusCode(500).setStatusMessage(e.getMessage());
        }
    }

    private void getLatestCart(RoutingContext routingContext) {
        Long id;
        try {
            id = cartService.getLatestCarts();
            routingContext.response()
                    .putHeader("content-type", "application/json; charset=utf-8")
                    .end(Json.encodePrettily(Collections.singletonMap("id", id)));
        } catch (SQLException e) {
            routingContext.response().setStatusCode(500).setStatusMessage(e.getMessage());
        }
    }

    private void getAllArticles(RoutingContext routingContext) {
        routingContext.response()
                .putHeader("content-type", "application/json; charset=utf-8")
                .end(Json.encodePrettily(Arrays.asList("savons", "lessive", "liquide_vaisselle", "papier_toilette",
                        "papier_sulfurise", "cotons_tiges", "lait", "yahourt", "cafe", "salade_lentilles", "jus_orange", "kiwi", "sauce_tomate",
                        "sardines", "madeleines", "fruits_secs", "kombucha", "crackers", "pistache", "jus_d'orange", "lait_bio_1%", "chocolat_au_lait")));
    }
}

