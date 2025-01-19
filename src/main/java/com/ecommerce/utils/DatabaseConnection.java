package com.ecommerce.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.Context;
import javax.sql.DataSource;

public class DatabaseConnection {
    Context context;
    DataSource dataSource = null;
    private static final String URL = "jdbc:mysql://localhost:3306/ecommerce"; // Replace with your database URL
    private static final String USERNAME = "root"; // Replace with your MySQL username
    private static final String PASSWORD = "1234"; // Replace with your MySQL password

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}