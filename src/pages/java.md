---
layout: ../components/JavaLayout.astro
---

### [part 2 tutaj](/java2)

### Quick Access
- [Przydatna składnia](#przydatna-składnia)
- [Klasa](#klasa-metody)
- [Enkapsulacja](#enkapsulacja)
- [Obiekty, Konstruktory](#obiekty-konstruktory)
- [Dziedziczenie](#dziedziczenie)
- [Klasa abstrakcynja](#klasa-abstrakcyjna)
- [Interfejs](#interfejs)
- [Kontenery](#kontenery)
- [Wyjątki](#wyjątki)
- [Pliki](#pliki)
- [Typy generyczne](#typy-generyczne)

### Przydatna składnia
```java
String result = "";
// dla każdego Polygona p w zbiorze this.polygons
for (Polygon p : this.polygons) {
    result += "<...>";
}

// formatowanie Stringów
String toInsert = "def";
String buh = String.format("abc %s ghi", toInsert);
// buh = "abc def ghi"

// tablica typu obiektowego
private Shape[] shapes = new Shape[30];
private Star[] stars = new Star[]{new Star(), new Star(), new Star()};

// komparator rozmiarów dwóch różnych typów kontenerów
import java.util.Collection;
import java.util.Comparator;
public class CollectionSizeComparator implements Comparator<Collection<?>> {
    @Override
    public int compare(Collection<?> c1, Collection<?> c2) {
        return Integer.compare(c1.size(), c2.size());
    }
}
```

### Klasa, Metody
Klasa to szablon za pomocą którego tworzymy obiekty.

Metoda to jakaś funkcja zapisana w klasie. Specjalne typy metod to akcesory `(gettery)` i mutatory `(settery)` - służą do zwracania wartości pól klasy lub ich zmieniania. Jest to potrzebne gdy mamy do czynienia z polami prywatnymi

Istnieją również metody statyczne, oznaczane słowem kluczowym `static`. Taka metoda nie wymaga obiektu, mamy dostęp do niej bezpośrednio z klasy. Dobrym przykładem jest np. String.format(). Zmienne, z których taka metoda korzysta, muszą być dane jako argument lub być również zdefiniowane jako statyczne. Zmienne statyczne są dostępne w taki sam sposób jak metody statyczne: `Klasa.zmienna`

```java
class Matma {
    public static int guh = 7;
    public static int dodaj(int a, int b) {
        return a + b;
    }
}

int buh = Matma.dodaj(5, 6);
int muh = Matma.guh;
// buh = 11
// muh = 7
```

### Enkapsulacja
Jest to sposób ograniczenia dostępu do pól i metod klasy

1. `public` - brak ograniczenia dostępu
```java
// Machine.java
public class Machine {
    public int number;
}

// Main.java
Machine machine = new Machine();
int x = machine.number;
machine.number = machine.number + 5;
```

2. `private` - dostęp tylko wewnątrz klasy
```java
// Machine.java
public class Machine {
    private int number;
    public int getNumber() {
        return this.number;
    }
    public void setNumber(int number) {
        this.number = number + 5;
    }
}

// Main.java
Machine machine = new Machine();
int x = machine.getNumber();
machine.setNumber(10);
```

3. `protected` - podobne do private, dostęp tylko w klasie oraz w innych klasach dziedziczących po niej
```java
// Machina.java
public class Machine {
    protected int number;
}

// Supercomputer.java
public class Supercomputer extends Machine {
    // klasa Supercomputer ma dostęp do pola number z klasy Machina
}

```

### Obiekty, Konstruktory
Obiekty to gotowe do użytku instancje danej klasy. Wewnątrz kodu klasy odwołujemy się do jej obiektu słowem kluczowym `this`. Jest to potrzebne gdy argument do np. konstruktora ma taką samą nazwę co jakieś pole klasy

Gdy tworzymy obiekt danej klasy, wywołujemy jego konstruktor - metoda określająca zachowanie podczas tworzenia obiektu. Może być wiele konstruktorów i Java wybierze odpowiedni na podstawie podanych argumentów.

```java
// Machine.java
public class Machine {
    private int number;

    // Domyślny konstruktor, po prostu tworzy obiekt, musimy sami przypisać wartości
    public Machine() {}

    public Machine(int number) {
        this.number = number;
    }
}
// Main.java
// Java wybiera odpowiedni konstruktor zależnie od podanych argumentów
Machine machina1 = new Machine();
// Bez customowego konstruktora nie możemy tak od razu podać wartości number jako argument
Machine machina2 = new Machine(5);
```

### Dziedziczenie
Dziedziczenie pozwala danej klasie wykorzystywać pola i metody innej klasy. Dziedziczone metody można wywoływać w klasie pochodnej za pomocą `super()`. Samo wywołanie `super()` spowoduje wywołanie konstruktora, można odwołać się do konkretnej metody poprzez `super.metoda()`

Metody dziedziczone można też nadpisać dopisując `@Override`. Aby klasa dziedziczyła po innej wykorzystujemy `extends` przy nagłówku klasy. Dany obiekt NIE MOŻE dziedziczyć po wielu obiektach.

Każda klasa dodatkowo dziedziczy po Object.

```java
// Car.java
public class Car {
    protected int power;
    public Car(int power) { this.power = power; }
    public void start() { /* ... */ }
    public int getPower() { return this.power; }
}

// RaceCar.java
public class RaceCar extends Car {
    private float fuelCapacity;
    private float currentFuel;
    public RaceCar(int power, float fuelCapacity) {
        // Wykorzystanie konstruktora Car
        super(power);
        this.fuelCapacity = fuelCapacity;
    }
    public int getSillyPower() {
        return super.getPower() * 2;
    }
    @Override
    public String start() {
        return "Odpalamy silnik...";
    }
}
```

### Klasa abstrakcyjna
Z klas abstrakcyjnych nie można tworzyć obiektów, zawierają one metody abstrakcyjne, które nie mają kodu, są tylko zdefiniowane. Wszystkie klasy dziedzicące po klasie abstrakcyjnej muszą implementować te metody.

Taka klasa może mieć też zwykłe pola i metody.

```java
// AbstractCar.java
public abstract class Car {
    protected int power;
    public int getPower() { return power; }
    // każda klasa dziedzicąca musi implementować startUp()
    public abstract String startUp();
}

// RaceCar.java
public class RaceCar extends Car {
    private float fuelCapacity;
    private float currentFuel;
    
    // MUSIMY implementować startUp()
    @Override
    public String startUp() {
        return "Odpalam silnik...";
    }
}
```

### Interfejs
Jest to zestaw metod, które muszą być implementowane przez klasy implementujące dany interfejs. Do takiej klasy w jej nagłówku dodajemy `implements`. Klasa może mieć wiele interfejsów.

```java
// Refuelable.java
public interface Refuelable {
    void refuel(float amount);
}

// RaceCar.java
public class RaceCar extends Car implements Refuelable {
    private float fuelCapacity;
    private float currentFuel;

    // implementujemy refuel z Refuelable
    @Override
    public void refuel(float amount) {
        currentFuel = Math.min(currentFuel+amount, fuelCapacity);
    }
    // implementujemy start z Car
    @Override
    public String start() {
        return "Odpalamy silnik...";
    }
}
```

### Kontenery
W angielskim też znane jako Collections, są to w pewnym sensie rodzaje tablic/list.

1. ArrayList / Lista

Typowa lista, każdy element ma swój index. W przypadku ArrayList nie musimy podawać rozmiaru

```java
List<RaceCar> raceCars = new ArrayList<>();
raceCars.add(new RaceCar(350.0f, 80.0f)); // raceCars[0]
raceCars.add(new RaceCar(400.0f, 90.0f)); // raceCars[1]
```

2. Set

Nieuporządkowana lista - każdy element musi być unikalny (nie może być dwóch takich samych)

```java
Set<String> raceCarBrands = new HashSet<>();
raceCarBrands.add("Ferrari");
raceCarBrands.add("Aston Martin");
raceCarBrands.add("Ford");
```

3. Map / HashMap

Można to potraktować jak lista, w której to my decydujemy jaki jest index elementów. Możemy nawet zmienić jego typ np. na String. Są to pary key : value, gdzie key (klucz) to nasz customowy index. Klucze nie mogą się powtarzać.

```java
Map<String, RaceCar> raceCarNumbers = new HashMap<>();
raceCarNumbers.put("buh", new RaceCar(420.0f, 100.0f));
raceCarNumbers.put("guh", new RaceCar(410.0f, 95.0f));

/*
{
    buh : RaceCar(420.0f, 100.0f),
    guh : RaceCar(410.0f, 95.0f)    
}
*/

RaceCar carBuh = raceCarNumbers.get("buh");
```

4. Kolejka / Queue / FIFO

Jest to coś jak lista, tylko nie mamy dostępu do indexów. Elementy są dodawane i wyjmowane wg. FIFO (first in first out) czyli jak normalna kolejka np. w sklepie.

```java
Queue<RaceCar> pitStopQueue = new LinkedList<>();
pitStopQueue.add(new RaceCar(370.0f, 85.0f));
pitStopQueue.add(new RaceCar(390.0f, 88.0f));
```

5. Stos / Stack

Podobny do kolejki, tylko korzystamy z LIFO (last in first out), czyli jak np. stos talerzy lub książek. Dodajemy na górę i zdejmujemy z góry.

```java
Stack<RaceCar> stack = new Stack<>();
stack.push(new RaceCar("RWD", 750, 360.0f, 80.0f));
stack.push(new RaceCar("AWD", 870, 400.0f, 90.0f));
```

### Wyjątki
Wyjątki to błędy które nasz kod może napotkać podczas działania. Wiele z nich trzeba jawnie przechwycić i obsłużyć wykorzystując słowa kluczowe `try` i `catch`.
Try zaznacza część kodu, w której może wystąpić dany błąd. Catch pozwala zdefiniować blok kodu, który będzie wykonany, gdy wyjątek zostanie złapany.

```java
// OverfillException.java
// tak naprawde większość wyjątków korzysta z tego wzoru i IntelliJ napisze to za nas gdy stworzymy plik wyjątku
public class OverfillException extends Exception {
    public OverfillException(String message) {
        super(message);
    }
}

// RaceCar.java
public class RaceCar extends Car implements Refuelable {
    private float currentFuel;
    private float fuelCapacity;
    /* ... */
    @Override
    // zaznaczamy, że metoda rzuca wyjątek
    public void refuel(float amount) throws OverfillException {
        if (currentFuel + amount > fuelCapacity) {
            throw new OverfillException("Nadmiar paliwa");
        }
        currentFuel += amount;
    }
}
```

### Pliki
Ponieważ java ma pierdyliard różnych klas z których możemy korzystać, istnieje sporo metod na operacje z plikami

Odczyt:
```java
// Odczyt pliku z BufferedReader, FileReader
import java.io.*;

try (BufferedReader br = new BufferedReader(new FileReader("plik.txt"))) {
    String linia;
    while ((linia = br.readLine()) != null) {
        System.out.println(linia);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

```java
// Odczyt pliku z Scanner, File
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

try {
    File plik = new File("dane.txt");
    Scanner scanner = new Scanner(plik);
    while (scanner.hasNextLine()) {
        String linia = scanner.nextLine();
        System.out.println(linia);
    }
    scanner.close();
} catch (FileNotFoundException e) {
    System.out.println("Nie znaleziono pliku.");
}
```

```java
// Odczyt pliku z Files.readAllLines()
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

try {
    List<String> linie = Files.readAllLines(Paths.get("plik.txt"));
    for (String linia : linie) {
        System.out.println(linia);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```
Zapis:

```java
// Zapis pliku z BufferedWriter, FileWriter
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

try (BufferedWriter writer = new BufferedWriter(new FileWriter("wynik.txt"))) {
    writer.write("To jest pierwszy wiersz.");
    writer.newLine();
    writer.write("To jest drugi wiersz.");
} catch (IOException e) {
    e.printStackTrace();
}
```

```java
// Zapis pliku z PrintWriter
import java.io.PrintWriter;
import java.io.IOException;

try (PrintWriter pw = new PrintWriter("dane.txt")) {
    pw.println("Jan Kowalski 30");
    pw.printf("Imię: %s, Wiek: %d%n", "Anna", 25);
} catch (IOException e) {
    e.printStackTrace();
}
```

```java
// Zapis pliku z Files.write()
// Ta metoda działa najlepiej dla prostych danych, np jakaś lista
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

try {
    Files.write(Paths.get("output.txt"), Arrays.asList("Linia 1", "Linia 2", "Linia 3"));
} catch (IOException e) {
    e.printStackTrace();
}
```

### Typy generyczne
Możemy napisać jedną metodę, która przyjmuje wiele różnych typów danych. Korzystaliśmy z tego podczas tworzeniu np. ArrayList.
```java
// Znacznik <Book> daje klasie List informacje, że tworzymy listę typu obiektowego Book.
// Wadą typów generycznych jest to, że możemy tutaj tylko korzystać z typów obiektowych.
// To znaczy, że nie możemy tutaj dać jako typ np. int.
List<Book> books = new ArrayList<>();
// Można ewentualnie skorzystać z obiektowego odpowiednika intów, Integer.
List<Integer> numbers = new ArrayList<>();

// Przykład klasy generycznej, znacznik T jest jakimkolwiek typem.
public class CookieCutter<T> {
    private T glaze;
}
CookieCutter<String> cookieCutter = new CookieCutter<>();
```

Klasa może mieć kilka typów generycznych. Korzysta z tego np. HashMap.
```java
public class Pair<T, S> {
    private T first;
    private S second;

    public Pair(T first, S second) {
        this.first = first;
        this.second = second;
    }

    public T getFirst() {
        return first;
    }

    public S getSecond() {
        return second;
    }
}
```

Możemy ustawić zestaw typów obiektowych, jakie przyjmuje nasza klasa używając `extends`.

```java
public interface Figure {
    String getName();
}

public class Circle implements Figure {
    public String getName() {
        return "buh";
    }
}

// <T extends Figure> oznacza, że typ musi dziedziczyć po Figure.
public class BoxForFigures<T extends Figure> {
    private T element;
    public BoxForFigures(T element) {
        this.element = element;
    }
}

// Circle dziedziczy po Figure.
BoxForFigures<Circle> circleBox = new BoxForFigures<>(new Circle());
```