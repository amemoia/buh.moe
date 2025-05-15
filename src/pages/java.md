---
layout: ../components/JavaLayout.astro
---

### Quick Access
- [Klasa](#klasa-metody)
- [Enkapsulacja](#enkapsulacja)
- [Obiekty, Konstruktory](#obiekty-konstruktory)
- [Dziedziczenie](#dziedziczenie)
- [Klasa abstrakcynja](#klasa-abstrakcyjna)
- [Interfejs](#interfejs)
- [Kontenery](#kontenery)
- [Wyjątki](#wyjątki)

### Klasa, Metody
Klasa to szablon za pomocą którego tworzymy obiekty.

Metoda to jakaś funkcja zapisana w klasie. Specjalne typy metod to akcesory (gettery) i mutatory (settery) - służą do zwracania wartości pól klasy lub ich zmieniania. Jest to potrzebne gdy mamy do czynienia z polami prywatnymi

### Enkapsulacja
Jest to sposób ograniczenia dostępu do pól i metod klasy
1. `public` - brak ograniczenia dostępu
```java
// Machine.java
public class Machine {
    public int number;
}

// Main.java
Machine machine = new Machine;
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
Machine machine = new Machine;
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
public class Supercomputer extends Machina {
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

```java
// Car.java
public class Car {
    protected int power;
    public Car(int power) { this.power = power; }
    public void start() { /* ... */ }
    public void getPower() { return this.power; }
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