package com.ecommerce.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

public class AdminLoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/admin.html").forward(req, resp);
    }

    // Simulated admin credentials (replace with database validation for real apps)
    private static final HashMap<String, String> adminCredentials = new HashMap<>();

    static {
        adminCredentials.put("admin", "password123"); // username -> password
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        resp.setContentType("application/json");

        if (adminCredentials.containsKey(username) && adminCredentials.get(username).equals(password)) {
            resp.getWriter().write("{\"status\": \"success\", \"message\": \"Admin login successful\"}");
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"status\": \"error\", \"message\": \"Invalid credentials\"}");
        }
    }
}
