package com.ecommerce.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.annotation.WebServlet;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@WebServlet(urlPatterns = {"/admin-login/dashboard", "/admin-login/product"})
public class AdminProductServlet extends HttpServlet {

    private static final Gson gson = new Gson();

    // Utility method to get the absolute path to the JSON file
    private String getJsonFilePath() {
        // Get the real path of the JSON file relative to the webapp folder
        return getServletContext().getRealPath("/items.json");
    }


    // Utility method to read products from the JSON file
    private List<HashMap<String, String>> readProductsFromFile() {
        String filePath = getJsonFilePath();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            return gson.fromJson(reader, new TypeToken<List<HashMap<String, String>>>() {}.getType());
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    

    // Utility method to write products to the JSON file
    private void writeProductsToFile(List<HashMap<String, String>> products) {
        String filePath = getJsonFilePath();
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            gson.toJson(products, writer);
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getRequestURI();

        if (path.endsWith("/dashboard")) {
            // Serve the HTML dashboard
            req.getRequestDispatcher("/admin-dashboard.html").forward(req, resp);
        } else if (path.endsWith("/product")) {
            // Serve the JSON response
            List<HashMap<String, String>> products = readProductsFromFile();
            String jsonResponse = gson.toJson(products);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(jsonResponse);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("404 - Not Found");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String productName = req.getParameter("name");
        String productImageUrl = req.getParameter("imageUrl");
        String productPrice = req.getParameter("price");
        String productRating = req.getParameter("rating");
        String productStockQuantity = req.getParameter("stockQuantity");

        // Read current products
        List<HashMap<String, String>> products = readProductsFromFile();

        // Create new product
        HashMap<String, String> product = new HashMap<>();
        product.put("id", String.valueOf(products.size() + 1));
        product.put("name", productName);
        product.put("image", productImageUrl);
        product.put("price", productPrice);
        product.put("rating", productRating);
        product.put("stock", productStockQuantity);

        // Add new product to the list
        products.add(product);

        // Save updated list of products to the file
        writeProductsToFile(products);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Product added successfully\"}");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String productId = req.getParameter("id");

        // Read current products
        List<HashMap<String, String>> products = readProductsFromFile();

        // Remove the product with the given ID
        products.removeIf(product -> product.get("id").equals(productId));

        // Save updated list of products to the file
        writeProductsToFile(products);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Product deleted successfully\"}");
    }
}
