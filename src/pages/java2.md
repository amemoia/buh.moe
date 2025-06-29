---
layout: ../components/JavaLayout.astro
---

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

* Definiuje układ GUI w XML.
* Przykład prostego fragmentu FXML z `Canvas`, `ColorPicker` i `Slider`:

```xml
<AnchorPane xmlns:fx="http://javafx.com/fxml" fx:controller="com.example.Controller">
    <children>
        <Canvas fx:id="canvas" width="400" height="400"/>
        <ColorPicker fx:id="colorPicker" layoutX="420" layoutY="20"/>
        <Slider fx:id="radiusSlider" layoutX="420" layoutY="70" min="1" max="100" value="30"/>
    </children>
</AnchorPane>
```

* `fx:id` to identyfikator pola w kontrolerze, pozwala powiązać element GUI z polem Java.

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

    public static void main(String[] args) {
        launch(args);
    }
}
```

* `FXMLLoader` ładuje strukturę z pliku i tworzy instancję kontrolera.
* `Stage` to okno aplikacji, `Scene` to jego zawartość.

## 2. **Kontroler**

### a) Definicja i powiązanie

```java
public class Controller {
    @FXML
    private Canvas canvas;

    @FXML
    private ColorPicker colorPicker;

    @FXML
    private Slider radiusSlider;

    private GraphicsContext gc;

    @FXML
    public void initialize() {
        gc = canvas.getGraphicsContext2D();
    }
}
```

* Pola oznaczone `@FXML` łączą się z `fx:id` z pliku FXML.
* Metoda `initialize()` jest wywoływana po załadowaniu FXML — dobry moment na przygotowanie obiektów (np. `GraphicsContext`).

### b) Konstruktor kontrolera a FXMLLoader

* Domyślnie FXMLLoader tworzy kontroler przez konstruktor bezparametrowy.
* Jeśli potrzebujesz przekazać parametry do kontrolera, musisz go stworzyć samodzielnie i ustawić `loader.setController(controller)` **PRZED** wywołaniem `loader.load()`.

## 3. **Canvas i rysowanie**

### a) Czym jest Canvas?

* `Canvas` to kontrolka przeznaczona do rysowania grafiki wektorowej.
* Aby rysować, pobieramy obiekt `GraphicsContext`.

### b) Podstawowe operacje na GraphicsContext

```java
GraphicsContext gc = canvas.getGraphicsContext2D();

// ustaw kolor wypełnienia
gc.setFill(Color.RED);

// rysuj koło (wypełniony okrąg)
gc.fillOval(x - radius, y - radius, radius * 2, radius * 2);

// czyszczenie canvas
gc.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
```

### c) Współrzędne i rozmiary

* Pozycja `(x, y)` jest zazwyczaj w pikselach, lewy górny róg to (0,0).
* Metody rysują figury na podstawie współrzędnych lewego górnego rogu prostokąta ograniczającego, stąd `x - radius`, `y - radius`.

## 4. **Kontrolki sterujące: ColorPicker i Slider**

### a) ColorPicker

* Pozwala użytkownikowi wybrać kolor.
* Wartość: `colorPicker.getValue()` zwraca obiekt `Color`.
* Można nasłuchiwać zmian koloru przez `colorPicker.setOnAction(event -> { ... })`.

### b) Slider

* Służy do wyboru wartości liczbowej w zadanym zakresie (`min`, `max`).
* Pobieranie aktualnej wartości: `radiusSlider.getValue()`.
* Można ustawić domyślną wartość i nasłuchiwać zdarzeń zmiany (`valueProperty().addListener(...)`).

## 5. **Obsługa zdarzeń myszy**

### a) Przykład obsługi kliknięcia

```java
canvas.setOnMouseClicked(event -> {
    double x = event.getX();
    double y = event.getY();
    Color color = colorPicker.getValue();
    double radius = radiusSlider.getValue();

    // rysowanie koła
    gc.setFill(color);
    gc.fillOval(x - radius, y - radius, radius * 2, radius * 2);
});
```

* `MouseEvent` zawiera informacje o współrzędnych kliknięcia.
* Można tu wprowadzić własną logikę (np. tworzenie obiektów, wysyłanie do serwera).

## 6. **Zarządzanie stanem i wielokrotne rysowanie**

### a) Czyszczenie i rysowanie

* Przed rysowaniem nowego elementu zwykle czyścimy Canvas (`gc.clearRect(...)`).
* Jeśli chcemy mieć trwały obraz z wieloma kółkami, musimy przechowywać ich listę i przy każdej zmianie rysować wszystko od nowa.

## 7. **Wątek JavaFX — reguła single-threaded GUI**

* Wszystkie zmiany w GUI muszą być wykonywane w **wątku JavaFX Application Thread**.
* Jeśli dane przychodzą z innego wątku (np. sieciowego), trzeba je przekazać do GUI przez:

```java
Platform.runLater(() -> {
    // zmiana GUI, np. rysowanie
});
```

## 8. **Łączenie GUI z modelem danych**

* Dane koła (np. `Dot`) są tworzone na podstawie kliknięcia i ustawień kontrolek.
* Te dane mogą być przesyłane dalej (np. do serwera) lub zapisywane lokalnie.
* GUI pełni rolę warstwy prezentacji i wejścia użytkownika.

## 9. **Przykładowy prosty schemat kontrolera**

```java
public class Controller {
    @FXML
    private Canvas canvas;
    @FXML
    private ColorPicker colorPicker;
    @FXML
    private Slider radiusSlider;

    private GraphicsContext gc;

    @FXML
    public void initialize() {
        gc = canvas.getGraphicsContext2D();
        canvas.setOnMouseClicked(this::handleClick);
    }

    private void handleClick(MouseEvent event) {
        double x = event.getX();
        double y = event.getY();
        Color color = colorPicker.getValue();
        double radius = radiusSlider.getValue();

        gc.setFill(color);
        gc.fillOval(x - radius, y - radius, radius * 2, radius * 2);
    }
}
```

# Programowanie klient–serwer

## 1. **Podstawowe pojęcia**

* **Serwer** — aplikacja działająca na określonym porcie, oczekująca na połączenia od klientów.
* **Klient** — aplikacja łącząca się z serwerem pod danym adresem IP i portem.
* **Socket** — punkt końcowy dwukierunkowego połączenia sieciowego (adres IP + port).
* **Port** — numer logiczny identyfikujący usługę na hoście.
* **Protokół tekstowy** — prosty sposób przesyłania danych jako tekstu, np. linie CSV.

## 2. **Kluczowe klasy Javy**

| Klasa            | Rola                                                   |
| ---------------- | ------------------------------------------------------ |
| `ServerSocket`   | Nasłuchuje na określonym porcie i akceptuje połączenia |
| `Socket`         | Reprezentuje połączenie między klientem a serwerem     |
| `InputStream`    | Strumień do odczytu danych z gniazda                   |
| `OutputStream`   | Strumień do zapisu danych do gniazda                   |
| `BufferedReader` | Czytanie tekstu z wejścia klienta                      |
| `PrintWriter`    | Wysyłanie tekstu do klienta                            |

## 3. **Serwer – jak działa?**

### a) Tworzenie serwera i nasłuchiwanie

```java
ServerSocket serverSocket = new ServerSocket(portNumber);
while (true) {
    Socket clientSocket = serverSocket.accept(); // czeka na połączenie klienta
    // obsługa klienta w nowym wątku
    new Thread(() -> handleClient(clientSocket)).start();
}
```

* `accept()` blokuje, aż klient się połączy.
* Po zaakceptowaniu połączenia tworzymy osobny wątek, by obsłużyć klienta (nie blokować głównego serwera).

### b) Obsługa klienta w wątku

```java
void handleClient(Socket socket) {
    try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
         PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {

        String line;
        while ((line = in.readLine()) != null) {
            // przetwarzanie linii (np. odbieranie wiadomości)
            System.out.println("Odebrano: " + line);

            // wysłanie odpowiedzi
            out.println("Potwierdzam: " + line);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

* Czytamy linie tekstu od klienta.
* Wysyłamy odpowiedzi do klienta.
* Wątek działa dopóki klient nie zamknie połączenia.

## 4. **Klient – jak działa?**

### a) Łączenie z serwerem

```java
Socket socket = new Socket(hostname, portNumber);
BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
```

* `hostname` to adres serwera (np. `"localhost"` lub IP).
* `portNumber` musi być taki, jak port serwera.

### b) Wysyłanie i odbieranie danych

```java
out.println("Wiadomość do serwera");
String response = in.readLine();
System.out.println("Odpowiedź serwera: " + response);
```

* Można w pętli wysyłać/odbierać wiadomości.

## 5. **Komunikacja tekstowa (protokół aplikacji)**

* W aplikacji często wysyła się dane w formacie tekstowym, np. CSV:

  ```
  x,y,radius,#RRGGBB
  ```
* Ułatwia to serializację i deserializację (konwersję do obiektów i odwrotnie).
* Protokół musi być dobrze zdefiniowany — np. jedna wiadomość to jedna linia tekstu.

---

## 6. **Obsługa wielu klientów (wielowątkowość)**

### a) Problem

* Serwer nie może blokować się na jednym kliencie — musi obsługiwać wielu jednocześnie.

### b) Rozwiązanie: osobny wątek na klienta

* Każde połączenie obsługujemy w osobnym wątku (`Thread` lub `Runnable`).
* Serwer ma listę aktywnych klientów (np. `List<ClientThread>`).

### c) Klasa klienta-serwera

```java
public class ClientHandler implements Runnable {
    private Socket socket;
    private BufferedReader in;
    private PrintWriter out;

    public ClientHandler(Socket socket) throws IOException {
        this.socket = socket;
        this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.out = new PrintWriter(socket.getOutputStream(), true);
    }

    @Override
    public void run() {
        // obsługa komunikacji
    }

    public void sendMessage(String msg) {
        out.println(msg);
    }
}
```

## 7. **Broadcast — wysyłanie do wszystkich klientów**

* Serwer przechowuje listę wątków klientów.
* Gdy przyjdzie nowa wiadomość, wysyła ją do wszystkich:

```java
synchronized void broadcast(String message) {
    for (ClientHandler client : clients) {
        client.sendMessage(message);
    }
}
```

* Synchronizacja (np. `synchronized`) zabezpiecza przed błędami podczas iteracji.

## 8. **Bezpieczeństwo i stabilność**

* Obsługa wyjątków `IOException` i zamykanie połączeń.
* Usuwanie klientów z listy po rozłączeniu.
* Zapobieganie blokowaniu GUI w aplikacjach klienta przez uruchamianie odbioru w osobnym wątku.

## 9. **Integracja z GUI (JavaFX)**

* Komunikacja sieciowa odbywa się w osobnych wątkach, aby nie blokować GUI.
* Odebrane dane przekazujemy do GUI przez `Platform.runLater()` (bo JavaFX wymaga aktualizacji GUI w swoim wątku).
* Wysyłanie danych z GUI (np. po kliknięciu) wywołuje metody klienta wysyłające tekst.

## 10. **Schemat działania**

| Etap            | Opis                                                       |
| --------------- | ---------------------------------------------------------- |
| Serwer          | Tworzy `ServerSocket`, akceptuje klientów w pętli          |
| Obsługa klienta | Każdy klient w osobnym wątku, czyta i pisze do gniazda     |
| Klient          | Łączy się z serwerem, wysyła i odbiera wiadomości          |
| Komunikacja     | Prosty protokół tekstowy (np. linie CSV)                   |
| Broadcast       | Serwer rozsyła otrzymane wiadomości do wszystkich klientów |

# Przykładowy minimalny przykład

### Serwer

```java
public class Server {
    private ServerSocket serverSocket;
    private List<ClientHandler> clients = new CopyOnWriteArrayList<>();

    public void start(int port) throws IOException {
        serverSocket = new ServerSocket(port);
        while (true) {
            Socket socket = serverSocket.accept();
            ClientHandler client = new ClientHandler(socket, this);
            clients.add(client);
            new Thread(client).start();
        }
    }

    public void broadcast(String msg) {
        for (ClientHandler client : clients) {
            client.sendMessage(msg);
        }
    }

    public void removeClient(ClientHandler client) {
        clients.remove(client);
    }
}
```

### ClientHandler

```java
public class ClientHandler implements Runnable {
    private Socket socket;
    private BufferedReader in;
    private PrintWriter out;
    private Server server;

    public ClientHandler(Socket socket, Server server) throws IOException {
        this.socket = socket;
        this.server = server;
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        out = new PrintWriter(socket.getOutputStream(), true);
    }

    public void run() {
        try {
            String line;
            while ((line = in.readLine()) != null) {
                server.broadcast(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            server.removeClient(this);
            try { socket.close(); } catch (IOException e) {}
        }
    }

    public void sendMessage(String msg) {
        out.println(msg);
    }
}
```

# Rekord

## 1. **Co to jest rekord w Javie?**

* Rekord (`record`) to specjalny, wprowadzony od Javy 14 typ klasy, który służy do **przechowywania niezmiennych danych**.
* Głównym celem jest prostota: automatyczne generowanie konstruktorów, metod `equals()`, `hashCode()`, `toString()`, a także **pól tylko do odczytu** (immutable).
* Rekord jest wzorcem danych (data carrier).

### Przykład deklaracji rekordu

```java
public record Dot(double x, double y, double radius, Color color) { }
```

* `x`, `y` — współrzędne środka koła.
* `radius` — promień koła.
* `color` — kolor obiektu (np. `javafx.scene.paint.Color`).

## 2. **Dlaczego używamy rekordu?**

* Prosty, czytelny kod.
* Automatycznie generowany konstruktor oraz metody.
* Immutable (pola finalne, brak setterów).
* Idealny do modelowania danych, które nie powinny się zmieniać po stworzeniu.

## 3. **Użycie rekordu Dot**

### a) Tworzenie obiektu

```java
Dot dot = new Dot(100.0, 150.0, 30.0, Color.RED);
```

### b) Dostęp do pól (metody automatycznie wygenerowane)

```java
double x = dot.x();
double y = dot.y();
double r = dot.radius();
Color c = dot.color();
```

## 4. **Metody pomocnicze — serializacja do tekstu i deserializacja**

W aplikacji klient–serwer często potrzebujemy przesyłać dane w formacie tekstowym (np. CSV). Rekord `Dot` może mieć dodatkowe metody:

### a) Konwersja do wiadomości tekstowej (`toMessage()`)

```java
public String toMessage() {
    return String.format("%f,%f,%f,%s",
                         x, y, radius, colorToHex(color));
}

private String colorToHex(Color c) {
    return String.format("#%02X%02X%02X",
                         (int)(c.getRed() * 255),
                         (int)(c.getGreen() * 255),
                         (int)(c.getBlue() * 255));
}
```

* Przykładowa wiadomość: `"100.0,150.0,30.0,#FF0000"`

### b) Konwersja z wiadomości tekstowej (`fromMessage()`)

```java
public static Dot fromMessage(String msg) {
    String[] parts = msg.split(",");
    double x = Double.parseDouble(parts[0]);
    double y = Double.parseDouble(parts[1]);
    double radius = Double.parseDouble(parts[2]);
    Color color = Color.web(parts[3]);
    return new Dot(x, y, radius, color);
}
```

* Zamienia tekst w formacie CSV z kolorem hex na obiekt `Dot`.

## 5. **Ważne szczegóły dotyczące koloru**

* Kolor jest przechowywany jako obiekt `javafx.scene.paint.Color`.
* Konwersja do hex RGB jest potrzebna do łatwego przesyłania w tekście.
* Metoda `Color.web(String)` pozwala utworzyć kolor z kodu hex.

## 6. **Zalety i zastosowanie rekordu Dot**

* **Prosty model danych** – odzwierciedla okrąg do rysowania.
* **Niezmienność** – chroni dane przed niechcianymi zmianami.
* **Łatwość przesyłania** – metody `toMessage` i `fromMessage` ułatwiają komunikację w sieci.
* **Przydatny w GUI i logice biznesowej** – może być używany w kontrolerze do rysowania, zapisywania do bazy i wysyłania przez sieć.

## 7. **Przykład kompletnej definicji rekordu**

```java
public record Dot(double x, double y, double radius, Color color) {

    public String toMessage() {
        return String.format("%f,%f,%f,%s",
            x, y, radius, colorToHex(color));
    }

    public static Dot fromMessage(String msg) {
        String[] parts = msg.split(",");
        double x = Double.parseDouble(parts[0]);
        double y = Double.parseDouble(parts[1]);
        double radius = Double.parseDouble(parts[2]);
        Color color = Color.web(parts[3]);
        return new Dot(x, y, radius, color);
    }

    private static String colorToHex(Color c) {
        return String.format("#%02X%02X%02X",
            (int)(c.getRed() * 255),
            (int)(c.getGreen() * 255),
            (int)(c.getBlue() * 255));
    }
}
```

# GUI

## 1. **Problem integracji**

* **GUI (JavaFX)** działa w **głównym wątku aplikacji** (JavaFX Application Thread).
* **Komunikacja sieciowa** (odbieranie i wysyłanie danych przez `Socket`) powinna działać w **oddzielnym wątku**, żeby nie zablokować GUI i nie spowodować "zamrożenia" interfejsu.
* Trzeba więc **komunikować się między wątkami** i aktualizować GUI w sposób bezpieczny.

## 2. **Wzorzec: konsumowanie odebranych danych (Consumer<T>)**

* Do obsługi danych, które przychodzą z sieci (np. obiektów `Dot`), stosuje się interfejs funkcyjny:

```java
Consumer<Dot> onDotReceived;
```

* Ten `Consumer` jest definiowany w kontrolerze i zawiera logikę, co zrobić z nowo odebranym kółkiem (np. narysować je na `Canvas`).

## 3. **Przykład implementacji w ServerThread (wątek odbierający dane)**

```java
public class ServerThread extends Thread {
    private Socket socket;
    private BufferedReader in;
    private Consumer<Dot> onDotReceived;

    public ServerThread(Socket socket) throws IOException {
        this.socket = socket;
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    public void setOnDotReceived(Consumer<Dot> consumer) {
        this.onDotReceived = consumer;
    }

    @Override
    public void run() {
        try {
            String line;
            while ((line = in.readLine()) != null) {
                Dot dot = Dot.fromMessage(line);
                if (onDotReceived != null) {
                    // Przekazujemy odebrane dane dalej
                    onDotReceived.accept(dot);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void send(Dot dot) throws IOException {
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println(dot.toMessage());
    }
}
```

## 4. **Obsługa odebranych danych w kontrolerze**

### a) Definiujemy Consumer w kontrolerze

```java
public class Controller {
    @FXML private Canvas canvas;
    private GraphicsContext gc;
    private ServerThread serverThread;

    @FXML
    public void initialize() {
        gc = canvas.getGraphicsContext2D();

        // Przyjmujemy klienta serwera (np. przekazany w konstruktorze)
        serverThread.setOnDotReceived(dot -> {
            // Aktualizacja GUI musi być w wątku JavaFX
            Platform.runLater(() -> drawDot(dot));
        });
    }

    private void drawDot(Dot dot) {
        gc.setFill(dot.color());
        gc.fillOval(dot.x() - dot.radius(), dot.y() - dot.radius(), dot.radius() * 2, dot.radius() * 2);
    }
}
```

* `Platform.runLater` zapewnia, że rysowanie na `Canvas` nastąpi bezpiecznie w głównym wątku GUI.

### b) Inicjalizacja `serverThread` i powiązanie Consumer

* `serverThread` można przekazać do kontrolera przez konstruktor lub setter.
* Po utworzeniu połączenia i uruchomieniu wątku należy ustawić `setOnDotReceived`.

## 5. **Wysyłanie danych z GUI**

* Po kliknięciu na Canvas lub innym zdarzeniu:

```java
canvas.setOnMouseClicked(event -> {
    double x = event.getX();
    double y = event.getY();
    Color color = colorPicker.getValue();
    double radius = radiusSlider.getValue();

    Dot dot = new Dot(x, y, radius, color);

    // Rysujemy lokalnie
    drawDot(dot);

    // Wysyłamy do serwera
    try {
        serverThread.send(dot);
    } catch (IOException e) {
        e.printStackTrace();
    }
});
```

* Najpierw rysujemy lokalnie, potem wysyłamy.
* Dzięki temu inne klienty dostaną i narysują to samo kółko.

## 6. **Podsumowanie zasad integracji**

| Krok              | Co robimy i dlaczego                           |
| ----------------- | ---------------------------------------------- |
| Komunikacja w tle | Unikamy blokowania GUI                         |
| Consumer<Dot>     | Przekazywanie odebranych danych do GUI         |
| Platform.runLater | Bezpieczna aktualizacja GUI z innego wątku     |
| Wysyłanie z GUI   | Wywołanie metody `send()` na wątku komunikacji |
| Rysowanie w GUI   | Metoda wywoływana w wątku JavaFX               |

## 7. **Typowy przepływ danych**

1. Użytkownik klika — tworzy się `Dot`.
2. `Dot` jest rysowany lokalnie na `Canvas`.
3. `Dot` jest serializowany do tekstu i wysłany do serwera.
4. Serwer rozsyła tekst do wszystkich klientów.
5. Każdy klient odbiera tekst, deserializuje do `Dot`.
6. `Consumer<Dot>` wywołuje rysowanie na GUI (przez `Platform.runLater`).

## 8. **Uwagi praktyczne**

* Zawsze obsługuj wyjątki przy komunikacji.
* Nie rób blokujących operacji w wątku GUI.
* Dbaj o zamykanie połączeń przy wyłączaniu aplikacji.
* Testuj komunikację z wieloma klientami.

# Baza danych

## 1. **Czym jest SQLite?**

* Lekka, wbudowana baza danych SQL, działająca bez serwera (plik na dysku).
* Idealna do małych i średnich aplikacji desktopowych.
* Przechowuje całą bazę w pojedynczym pliku (`.db`).
* Nie wymaga instalacji serwera ani konfiguracji.

## 2. **Konfiguracja środowiska Java**

### a) Sterownik JDBC dla SQLite

* Potrzebujesz biblioteki JDBC SQLite (np. `sqlite-jdbc-3.x.x.jar`).
* Możesz dodać ją przez Maven, Gradle lub ręcznie do classpath.

## 3. **Łączenie się z bazą**

```java
String url = "jdbc:sqlite:circleapp.db";
try (Connection conn = DriverManager.getConnection(url)) {
    if (conn != null) {
        System.out.println("Połączono z bazą SQLite");
    }
} catch (SQLException e) {
    System.out.println(e.getMessage());
}
```

* Jeśli plik `circleapp.db` nie istnieje, SQLite go utworzy.

## 4. **Tworzenie tabeli `dot`**

```sql
CREATE TABLE IF NOT EXISTS dot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT NOT NULL,
    radius INTEGER NOT NULL
);
```

* `id` to unikalny klucz główny.
* `x`, `y`, `radius` — współrzędne i rozmiar (typ `INTEGER`).
* `color` — tekst (np. `#RRGGBB`).

### Tworzenie tabeli w Javie:

```java
String sql = """
    CREATE TABLE IF NOT EXISTS dot (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        color TEXT NOT NULL,
        radius INTEGER NOT NULL
    );
""";

try (Statement stmt = conn.createStatement()) {
    stmt.execute(sql);
} catch (SQLException e) {
    e.printStackTrace();
}
```

## 5. **Wstawianie danych do tabeli**

```java
String sql = "INSERT INTO dot(x, y, color, radius) VALUES(?, ?, ?, ?)";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, (int)dot.x());
    pstmt.setInt(2, (int)dot.y());
    pstmt.setString(3, colorToHex(dot.color()));
    pstmt.setInt(4, (int)dot.radius());
    pstmt.executeUpdate();
} catch (SQLException e) {
    e.printStackTrace();
}
```

* Używamy `PreparedStatement` by uniknąć błędów i zabezpieczyć dane.
* Konwersja z `Color` do hex to np.:

```java
private String colorToHex(Color color) {
    return String.format("#%02X%02X%02X",
        (int)(color.getRed() * 255),
        (int)(color.getGreen() * 255),
        (int)(color.getBlue() * 255));
}
```

## 6. **Odczytywanie danych z tabeli**

```java
String sql = "SELECT x, y, color, radius FROM dot";
List<Dot> dots = new ArrayList<>();

try (Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery(sql)) {

    while (rs.next()) {
        double x = rs.getInt("x");
        double y = rs.getInt("y");
        double radius = rs.getInt("radius");
        Color color = Color.web(rs.getString("color"));
        dots.add(new Dot(x, y, radius, color));
    }
} catch (SQLException e) {
    e.printStackTrace();
}
```

* `ResultSet` iterujemy, tworząc obiekty `Dot` z wierszy.

## 7. **Zamykanie połączeń**

* Połączenie (`Connection`) oraz `Statement` i `ResultSet` należy zawsze zamykać.
* Najlepiej używać try-with-resources (`try(...) {}`), co automatycznie zamyka zasoby.

## 8. **Integracja z aplikacją**

* Po uruchomieniu aplikacji łączymy się z bazą, tworzymy tabelę jeśli nie istnieje.
* Podczas rysowania i wysyłania nowego kółka zapisujemy je do bazy.
* Po podłączeniu nowego klienta wysyłamy mu wszystkie zapisane koła z bazy (tzw. replay).

## 9. **Przykład metody zapisu kółka**

```java
public void saveDot(Dot dot) {
    String sql = "INSERT INTO dot(x, y, color, radius) VALUES(?, ?, ?, ?)";
    try (Connection conn = DriverManager.getConnection(url);
         PreparedStatement pstmt = conn.prepareStatement(sql)) {
        pstmt.setInt(1, (int)dot.x());
        pstmt.setInt(2, (int)dot.y());
        pstmt.setString(3, colorToHex(dot.color()));
        pstmt.setInt(4, (int)dot.radius());
        pstmt.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
```

## 10. **Uwagi końcowe**

* SQLite jest szybkie i wygodne, ale nie nadaje się do bardzo dużych, wielodostępnych systemów.
* W aplikacjach desktopowych jest świetnym wyborem do prostych lokalnych baz.
* Ważne jest poprawne zarządzanie połączeniami i transakcjami (w bardziej złożonych aplikacjach).
