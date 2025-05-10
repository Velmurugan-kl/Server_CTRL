package com.example.my_tv_dash;

import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

public class httpHelper {
    public static void sendCommand(String command) {
        new Thread(() -> {
            try {
                URL url = new URL("http://192.168.1.14/control");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; utf-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoOutput(true);

                String jsonInputString = "command=" + command;

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonInputString.getBytes("utf-8");
                    os.write(input, 0, input.length);
                }

                int responseCode = conn.getResponseCode();
                Log.d("HTTP", "Response Code: " + responseCode);

                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }



    public static void sendGetCommand(String command, HttpCallback callback) {
        new Thread(() -> {
            try {
                String urlString = "http://192.168.1.14/control?command=" + command;
                URL url = new URL(urlString);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");

                int responseCode = conn.getResponseCode();
                Log.d("HTTP", "GET Response Code: " + responseCode);

                StringBuilder response = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                }

                conn.disconnect();

                // Parse the JSON and extract "status"
                JSONObject jsonObject = new JSONObject(response.toString());
                String status = jsonObject.getString("status");

                if (callback != null) {
                    callback.onSuccess(status);  // Return only the status string
                }

            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e);
                }
            }
        }).start();
    }



    public interface HttpCallback {
        void onSuccess(String response);
        void onError(Exception e);
    }



}
