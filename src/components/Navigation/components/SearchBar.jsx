import { useState, useEffect, useRef, useCallback } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { productAPI } from "@/api/product.api";
import { cn } from "@/lib/utils";

export function SearchBar({ className = "" }) {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search suggestions
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await productAPI.search({
          keyword: searchText.trim(),
          size: 5, // Limit to 5 suggestions
        });
        setSuggestions(response.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e?.preventDefault();
      if (searchText.trim()) {
        setShowSuggestions(false);
        navigate(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
      }
    },
    [searchText, navigate]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchText(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleClear = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative w-full max-w-md", className)} ref={searchRef}>
      <form
        onSubmit={handleSearch}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Input
            placeholder="Tìm kiếm..."
            className="pl-4 pr-10 flex-1 shadow-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 || loading) {
                setShowSuggestions(true);
              }
            }}
          />
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          className="h-8 px-4"
          disabled={!searchText.trim()}
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && searchText.trim() && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                </button>
              ))}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full p-3 text-sm font-medium text-primary hover:bg-gray-50 border-t"
              >
                Xem tất cả kết quả cho "{searchText}"
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Không tìm thấy
            </div>
          )}
        </div>
      )}
    </div>
  );
}
