import java.util.ArrayList;
import java.util.List;

public class FavoriteStore {
    private String userId; // User email, PK
    private List<String> storeIds; // List of favorite store IDs

    public FavoriteStore(String userId) {
        this.userId = userId;
        this.storeIds = new ArrayList<>();
    }

    // Add to favorites
    public void addFavorite(String storeId) {
        if (!storeIds.contains(storeId)) {
            storeIds.add(storeId);
            System.out.println("Store " + storeId + " has been added to favorites.");
        } else {
            System.out.println("Store " + storeId + " is already in favorites.");
        }
    }

    // Remove from favorites
    public void removeFavorite(String storeId) {
        if (storeIds.contains(storeId)) {
            storeIds.remove(storeId);
            System.out.println("Store " + storeId + " has been removed from favorites.");
        } else {
            System.out.println("Store " + storeId + " is not in favorites.");
        }
    }

    // List favorites
    public List<String> listFavorites() {
        return new ArrayList<>(storeIds);
    }

    // Find a specific favorite
    public boolean findFavorite(String storeId) {
        return storeIds.contains(storeId);
    }

    // Main method (for testing)
    public static void main(String[] args) {
        FavoriteStore userFavorites = new FavoriteStore("user@example.com");

        userFavorites.addFavorite("store1");
        userFavorites.addFavorite("store2");
        System.out.println(userFavorites.listFavorites()); // [store1, store2]

        userFavorites.removeFavorite("store1");
        System.out.println(userFavorites.listFavorites()); // [store2]

        System.out.println(userFavorites.findFavorite("store2")); // true
        System.out.println(userFavorites.findFavorite("store1")); // false
    }
}
