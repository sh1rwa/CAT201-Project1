package com.ecommerce.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class AdminProductServlet extends HttpServlet {

    // Simulated product database
    private static final List<HashMap<String, String>> products = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/admin-dashboard.html").forward(req, resp);
        resp.setContentType("application/json");
        resp.getWriter().write(products.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String productName = req.getParameter("name");
        String productPrice = req.getParameter("price");

        HashMap<String, String> product = new HashMap<>();
        product.put("id", String.valueOf(products.size() + 1));
        product.put("name", productName);
        product.put("price", productPrice);

        products.add(product);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Product added successfully\"}");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String productId = req.getParameter("id");

        products.removeIf(product -> product.get("id").equals(productId));

        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\": \"success\", \"message\": \"Product deleted successfully\"}");
    }
}
