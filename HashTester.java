import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashTester {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashFromDb = "$2a$10$j7wBLy9EIpaSVSZA3S.Ru..gUua9yt12uQ7anxTr5Mt7JMkYLFH2.";
        System.out.println("Matches DB hash: " + encoder.matches("password", hashFromDb));
        System.out.println("New hash generated: " + encoder.encode("password"));
    }
}
