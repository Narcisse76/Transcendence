# Monitoring System / Prometheus & Grafana
## What is Prometheus?
Prometheus is an open-source monitoring and alerting system that collects and stores metrics as time-series data. It periodically scrapes metrics exposed by applications and exporters, allowing developers to monitor application health, resource usage, and system performance.

## What is Grafana
Grafana is an open-source observability and visualization platform that connects to data sources such as Prometheus to display metrics through dashboards, graphs, and status panels. It provides a centralized interface to monitor the health and performance of the application.

## What makes the monitoring system effective?
1. **Application Metrics:** The Node.js server exposes a `/metrics` endpoint using `prom-client`, providing runtime metrics and custom game metrics.
2. **System Monitoring:** Node Exporter exposes system-level metrics such as CPU usage, memory consumption, disk activity, and network statistics.
3. **Centralized Collection:** Prometheus periodically collects metrics from the game server and exporters using configurable scrape jobs.
4. **Custom Dashboards:** Grafana displays relevant application and system metrics, including connected players, active rooms, gameplay activity, CPU usage, and memory usage.
5. **Alerting Rules:** Prometheus evaluates alerting rules to detect conditions such as an unavailable game server or excessive resource usage.
6. **Access Security:** Grafana access is protected by authentication, public sign-up is disabled, and administrator credentials are managed outside the source code.

## Configuration & tuning
### Key `prometheus.yml` settings:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - /etc/prometheus/rules/alerts.yml

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["prometheus:9090"]

  - job_name: "game-server"
    metrics_path: /metrics
    static_configs:
      - targets: ["game:3001"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]
```

- `scrape_interval`: Defines how frequently Prometheus collects metrics.
- `evaluation_interval`: Defines how frequently alerting and recording rules are evaluated.
- `rule_files`: Loads the configured Prometheus alerting rules.
- `scrape_configs`: Defines the Prometheus server and application/exporter targets to monitor.

### Node.js metrics with `prom-client`
The game server exposes Prometheus-compatible metrics through an HTTP endpoint.

Example:

```javascript
import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

Custom application metrics can be added to monitor the state and activity of the game.

Examples include:

- `game_connected_players`: Number of currently connected players.
- `game_active_rooms`: Number of active game rooms.
- `game_waiting_players`: Number of players waiting for a match.
- `game_player_moves_total`: Total number of player movement events.
- `game_player_shots_total`: Total number of player shots.
- `game_player_hits_total`: Total number of player hit events.

These metrics help distinguish application-level problems from infrastructure-level problems.

### Key `alerts.yml` settings:
```yaml
groups:
  - name: transcendence-alerts
    rules:
      - alert: GameServerDown
        expr: up{job="game-server"} == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "Game server is down"
          description: "The Transcendence game server has been unreachable for more than 30 seconds."
      - alert: HighMemoryUsage
        expr: 100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) > 90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 90% for more than 2 minutes."
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is above 90% for more than 2 minutes."
      - alert: TooManyPlayers
        expr: game_connected_players > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High number of connected players"
          description: "More than 10 players are connected."
```

### Grafana dashboards
The Grafana dashboard should provide a clear overview of the application's health and performance and key game KPIs.

Panels currently implemented:
- **Game Server Status:** Indicates whether Prometheus can scrape the game server.
- **Connected Players:** Displays the number of connected players.
- **Active Rooms:** Displays the number of active game rooms.
- **Waiting Players:** Displays the number of players waiting for a match.
- **Gameplay Activity:** Shows the rate of movement, shot, and hit events.
- **CPU Usage:** Displays system CPU utilization.
- **Memory Usage:** Displays system memory utilization.
- **Network and Disk Activity:** Displays system-level metrics collected by Node Exporter.

### Grafana security settings
```yaml
environment:
  GF_SECURITY_ADMIN_USER: ${GRAFANA_ADMIN_USER}
  GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}
  GF_USERS_ALLOW_SIGN_UP: "false"
```

## Where is it implemented?
### Node.js game server - `server-test/server.js`
The game server exposes the `/metrics` endpoint and registers application-specific metrics through `prom-client`.

It provides visibility into the game's runtime, player connections, rooms, and gameplay events.

### Prometheus - `monitoring/prometheus/prometheus.yml`
This configuration defines scrape targets for the game server, Prometheus itself, and Node Exporter.

Prometheus collects the metrics and evaluates the configured alerting rules.

### Prometheus alerting rules - `monitoring/prometheus/rules/alerts.yml`
This file contains rules for detecting server availability problems and excessive resource usage.

### Node Exporter
Node Exporter exposes operating-system metrics for the machine running the application, including CPU, memory, disk, and network statistics.

### Grafana - `monitoring/grafana/`
Grafana connects to Prometheus as a data source and displays the collected metrics through custom dashboards.

Provisioning files can be stored here to automate data-source and dashboard configuration.
