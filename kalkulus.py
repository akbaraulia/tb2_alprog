import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import CubicSpline
from scipy.integrate import quad

# Data titik (x, y)
x = np.array([1, 2, 3, 4])  # Posisi x
y = np.array([2, 3, 5, 4])  # Ketinggian y

# Skalasi data x dan y untuk mencocokkan pola nyata
x_scaled = x * 4  # Skala x (misalnya lebar pola)
def scale_y_for_target_area(x, y, target_area):
    """Menskalakan y agar luas area di bawah kurva sesuai target."""
    cs = CubicSpline(x, y, bc_type='not-a-knot')
    current_area, _ = quad(cs, x[0], x[-1])
    scaling_factor = target_area / current_area
    return y * scaling_factor

target_area = 16  # Target luas area (cm²)
y_scaled = scale_y_for_target_area(x_scaled, y, target_area)

# Buat spline untuk kedua jenis interpolasi
cs_scaled = CubicSpline(x_scaled, y_scaled, bc_type='not-a-knot')  # Kubik Spline biasa
natural_cs_scaled = CubicSpline(x_scaled, y_scaled, bc_type='natural')  # Natural Kubik Spline

# Fungsi panjang kurva
def length_of_curve(spline, x_start, x_end):
    """Menghitung panjang kurva menggunakan integral."""
    integrand = lambda x: np.sqrt(1 + (spline(x, 1))**2)  # Turunan pertama
    length, _ = quad(integrand, x_start, x_end)
    return length

# Hitung panjang kurva
length_cs_scaled = length_of_curve(cs_scaled, x_scaled[0], x_scaled[-1])
length_natural_scaled = length_of_curve(natural_cs_scaled, x_scaled[0], x_scaled[-1])

# Output panjang kurva
print(f"Panjang kurva Kubik Spline (biasa): {length_cs_scaled:.3f} cm")
print(f"Panjang kurva Natural Kubik Spline: {length_natural_scaled:.3f} cm")

# Plot grafik interpolasi
x_fine = np.linspace(min(x_scaled), max(x_scaled), 500)
y_cs_scaled = cs_scaled(x_fine)
y_natural_scaled = natural_cs_scaled(x_fine)

plt.figure(figsize=(10, 6))
plt.plot(x_fine, y_cs_scaled, label="Kubik Spline (Biasa)", color='blue')
plt.plot(x_fine, y_natural_scaled, label="Natural Kubik Spline", color='green', linestyle='--')
plt.scatter(x_scaled, y_scaled, label="Titik Data (Diskalakan)", color='red', zorder=5)
plt.fill_between(x_fine, y_cs_scaled, alpha=0.2, color='blue', label="Area Kubik Spline")
plt.fill_between(x_fine, y_natural_scaled, alpha=0.2, color='green', label="Area Natural Kubik Spline")
plt.title("Interpolasi Kubik Spline vs Natural Kubik Spline (Diskalakan)")
plt.xlabel("x (Diskalakan)")
plt.ylabel("y (Diskalakan)")
plt.axhline(0, color='black', linewidth=0.8, linestyle='--', alpha=0.7)
plt.axvline(0, color='black', linewidth=0.8, linestyle='--', alpha=0.7)
plt.grid(alpha=0.3)
plt.legend()
plt.show()
