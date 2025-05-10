package com.example.my_tv_dash;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.fragment.app.FragmentActivity;

public class MainActivity extends FragmentActivity {

    private final String[] currentState = {""}; // "on" or "off"

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        View serverCard = findViewById(R.id.serverCard);
        Button serverButton = serverCard.findViewById(R.id.power_button);
        TextView serverStatus = serverCard.findViewById(R.id.statusText);

        View pingCard = findViewById(R.id.pingCard);
        TextView pingStatus = pingCard.findViewById(R.id.statusText);

        ImageButton refreshButton = findViewById(R.id.refreshButton);


        // Toggle NAS on/off
        serverButton.setOnClickListener(v -> {
            String cmdToSend = "on".equalsIgnoreCase(currentState[0]) ? "NAS_OFF" : "NAS_ON";
            httpHelper.sendCommand(cmdToSend);
            serverStatus.setText("Sending " + cmdToSend);
        });

        // Refresh both SERVER and NAS states
        refreshButton.setOnClickListener(v -> {
            // Get SERVER status
            httpHelper.sendGetCommand("SERVER", new httpHelper.HttpCallback() {
                @Override
                public void onSuccess(String status) {
                    runOnUiThread(() -> serverStatus.setText("Server: " + status));
                }

                @Override
                public void onError(Exception e) {
                    runOnUiThread(() -> serverStatus.setText("Server Error"));
                    e.printStackTrace();
                }
            });

            // Get NAS status
            httpHelper.sendGetCommand("NAS", new httpHelper.HttpCallback() {
                @Override
                public void onSuccess(String status) {
                    runOnUiThread(() -> {
                        currentState[0] = status;
                        pingStatus.setText("NAS: " + status);

                        if ("on".equalsIgnoreCase(status)) {
                            serverButton.setText("Power Off");
                        } else if ("off".equalsIgnoreCase(status)) {
                            serverButton.setText("Power On");
                        } else {
                            serverButton.setText("Unknown");
                        }
                    });
                }

                @Override
                public void onError(Exception e) {
                    runOnUiThread(() -> {
                        pingStatus.setText("NAS Error");
                        serverButton.setText("Retry");
                    });
                    e.printStackTrace();
                }
            });
        });

        // === Router Card (still stubbed) ===
        View routerCard = findViewById(R.id.routerCard);
        Button routerButton = routerCard.findViewById(R.id.power_button);
        TextView routerStatus = routerCard.findViewById(R.id.statusText);

        routerButton.setOnClickListener(v -> {
            routerStatus.setText("Restarting Router");
            // TODO: Implement POST for router
        });
    }

}
