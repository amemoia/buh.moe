---
layout: ../layouts/Base.astro
title: "buh / java2"
---

<style is:global>
    html, body, #___astro {
        font-family: sans-serif !important;
    }
    
    main a {
        color: var(--color-accent-green) !important;
        font-weight: 500;
        text-decoration: none;
    }
    
    main a:hover {
        text-decoration: underline;
    }

    pre {
        background-color: #111 !important;
        padding: 1rem;
        border: 1px solid #333;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin-bottom: 1rem;
    }

    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }

    h1, h2, h3, h4 {
        font-weight: bold;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }

    h1 { font-size: 2.25rem; }
    h2 { font-size: 1.875rem; }
    h3 { font-size: 1.5rem; }
</style>

<div class="flex flex-row flex-wrap gap-4 border-b border-zinc-800 pb-4 mb-4 text-base">
    <a href="https://github.com/amemoia/ProgramowanieJava2025" target="_blank">GitHub</a>
    <a href="https://www.geeksforgeeks.org/java-cheat-sheet/" target="_blank">GeeksForGeeks</a>
    <a href="https://www.geeksforgeeks.org/collections-in-java-2/" target="_blank">Kolekcje/Kontenery</a>
    <a href="https://github.com/KarKor?tab=repositories" target="_blank">GH Karola</a>
</div>

### [part 1 tutaj](/java)

**Uwaga!** Ta strona jest bardzo leniwym opracowaniem powtórzenia do kolowkium. Nothing will save us.

### Quick Access
- [JavaFX](#javafx)
- [klient-serwer](#programowanie-klientserwer)
- [rekord](#rekord)
- [GUI](#gui)
- [baza danych](#baza-danych)

# JavaFX

## 1. **Tworzenie GUI w JavaFX**
### a) Struktura projektu
* Plik **FXML** — XML opisujący układ i kontrolki UI.
* Klasa **Kontroler** — obsługuje logikę, reaguje na zdarzenia, manipuluje widokiem.
* Klasa **Main** (startowa) — uruchamia aplikację, ładuje FXML i ustawia scenę.

### b) Plik FXML
```xml
<AnchorPane xmlns:fx="http://javafx.com/fxml" fx:controller="com.example.Controller">
    <children>
        <Canvas fx:id="canvas" width="400" height="400"/>
        <ColorPicker fx:id="colorPicker" layoutX="420" layoutY="20"/>
        <Slider fx:id="radiusSlider" layoutX="420" layoutY="70" min="1" max="100" value="30"/>
    </children>
</AnchorPane>
```

### c) Ładowanie FXML i uruchamianie aplikacji
```java
public class Main extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("app-view.fxml"));
        Parent root = loader.load();
        Scene scene = new Scene(root);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Circle Drawer");
        primaryStage.show();
    }
    public static void main(String[] args) { launch(args); }
}
```

## 2. **Kontroler**
```java
public class Controller {
    @FXML private Canvas canvas;
    @FXML private ColorPicker colorPicker;
    @FXML private Slider radiusSlider;
    private GraphicsContext gc;
    @FXML public void initialize() { gc = canvas.getGraphicsContext2D(); }
}
```

## 3. **Canvas i rysowanie**
```java
GraphicsContext gc = canvas.getGraphicsContext2D();
gc.setFill(Color.RED);
gc.fillOval(x - radius, y - radius, radius * 2, radius * 2);
gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
```

# Programowanie klient–serwer

## 1. **Podstawowe pojęcia**
* **Serwer** — oczekuje na połączenia na porcie.
* **Klient** — łączy się z serwerem.
* **Socket** — punkt końcowy połączenia.

## 2. **Kluczowe klasy Javy**
| Klasa | Rola |
| --- | --- |
| `ServerSocket` | Nasłuchuje połączeń |
| `Socket` | Połączenie klient-serwer |
| `BufferedReader` | Czytanie tekstu |
| `PrintWriter` | Wysyłanie tekstu |

## 3. **Serwer – jak działa?**
```java
void handleClient(Socket socket) {
    try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
         PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
        String line;
        while ((line = in.readLine()) != null) {
            System.out.println("Odebrano: " + line);
            out.println("Potwierdzam: " + line);
        }
    } catch (IOException e) { e.printStackTrace(); }
}
```

# Rekord
## 1. **Co to jest rekord?**
`record` (Java 14+) służy do przechowywania niezmiennych danych.
```java
public record Dot(double x, double y, double radius, Color color) {
    public String toMessage() { return String.format("%f,%f,%f,%s", x, y, radius, colorToHex(color)); }
    public static Dot fromMessage(String msg) {
        String[] parts = msg.split(",");
        return new Dot(Double.parseDouble(parts[0]), Double.parseDouble(parts[1]), Double.parseDouble(parts[2]), Color.web(parts[3]));
    }
}
```

# Baza danych
## 1. **Tworzenie tabeli**
```sql
CREATE TABLE IF NOT EXISTS dot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT NOT NULL,
    radius INTEGER NOT NULL
);
```
## 2. **Wstawianie i odczyt**
```java
String sql = "INSERT INTO dot(x, y, color, radius) VALUES(?, ?, ?, ?)";
// ... (PreparedStatement)
String query = "SELECT x, y, color, radius FROM dot";
// ... (ResultSet)
```
