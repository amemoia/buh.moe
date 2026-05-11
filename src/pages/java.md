---
layout: ../layouts/Base.astro
title: "buh / java"
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

### [part 2 tutaj](/java2)

### Quick Access
- [part 2 tutaj](#part-2-tutaj)
- [Quick Access](#quick-access)
- [Przydatna składnia](#przydatna-składnia)
- [Klasa, Metody](#klasa-metody)
- [Enkapsulacja](#enkapsulacja)
- [Obiekty, Konstruktory](#obiekty-konstruktory)
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

### Obiekty, Konstruktory
```java
// Java wybiera odpowiedni konstruktor zależnie od podanych argumentów
Machine machina1 = new Machine();
// Bez customowego konstruktora nie możemy tak od razu podać wartości number jako argument
Machine machina2 = new Machine(5);
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
```java
public class OverfillException extends Exception {
    public OverfillException(String message) {
        super(message);
    }
}
```

### Pliki
```java
// Odczyt pliku z BufferedReader, FileReader
try (BufferedReader br = new BufferedReader(new FileReader("plik.txt"))) {
    String linia;
    while ((linia = br.readLine()) != null) {
        System.out.println(linia);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Zapis pliku z Files.write()
try {
    Files.write(Paths.get("output.txt"), Arrays.asList("Linia 1", "Linia 2", "Linia 3"));
} catch (IOException e) {
    e.printStackTrace();
}
```

### Typy generyczne
```java
List<Book> books = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

public class CookieCutter<T> {
    private T glaze;
}
CookieCutter<String> cookieCutter = new CookieCutter<>();
```

```java
// Circle dziedziczy po Figure.
BoxForFigures<Circle> circleBox = new BoxForFigures<>(new Circle());
```
