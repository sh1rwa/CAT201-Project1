package com.ecommerce.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/login")
public class UserLoginServlet extends HttpServlet {

    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String filePath = getServletContext().getRealPath("/login.html");


        response.setContentType("text/html");
        Files.copy(Paths.get(filePath), response.getOutputStream());
}

@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("login-username");
        String password = request.getParameter("login-password");

        Context context;
        DataSource dataSource = null;


        try {
            // Get the initial context for JNDI lookup
            context = new InitialContext();
            // Perform JNDI lookup for the data source configured in GlassFish
            dataSource = (DataSource) context.lookup("ecommerce");

            // Get a connection from the pool
            try (Connection connection = dataSource.getConnection()) {
                String query = "SELECT * FROM customer WHERE username = ? AND password = ?";
                try (PreparedStatement statement = connection.prepareStatement(query)) {
                    statement.setString(1, username);
                    statement.setString(2, password);
                    ResultSet resultSet = statement.executeQuery();

                    response.setContentType("application/json");
                    PrintWriter out = response.getWriter();
                    // Check if the user exists
                    if (resultSet.next()) {
                        response.sendRedirect("http://desktop-9frtm12:8080/cart.html");
                        //response.setContentType("application/json");
                        //out.print("{\"status\":\"success\", \"redirect\":\"\"}");
                    } else {
                        response.setContentType("application/json");
                        out.print("{\"status\":\"error\", \"message\":\"Invalid credentials\"}");
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
                throw new ServletException("Database error occurred", e);
            }
        } catch (NamingException e) {
            e.printStackTrace();
            throw new ServletException("JNDI lookup failed", e);
        }
    }
}
