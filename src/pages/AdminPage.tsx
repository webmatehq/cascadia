import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBeerList, type BeerItem } from "@/context/BeerListContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

const AdminPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { beers, addBeer, updateBeer, removeBeer, resetBeers } = useBeerList();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    abv: "",
    price: "",
  });

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = login(email, password);
    if (!success) {
      setLoginError("Las credenciales no son correctas.");
      return;
    }
    setLoginError("");
    setEmail("");
    setPassword("");
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.abv.trim()) {
      setFormError("Completa el nombre y el porcentaje de alcohol.");
      return;
    }

    const price = formState.price.trim();
    const beer: BeerItem = {
      name: formState.name.trim(),
      abv: formState.abv.trim(),
      price: price ? Number(price) : undefined,
    };

    if (Number.isNaN(beer.price)) {
      setFormError("El precio debe ser un número válido.");
      return;
    }

    if (editingIndex !== null) {
      updateBeer(editingIndex, beer);
    } else {
      addBeer(beer);
    }

    setFormError("");
    setEditingIndex(null);
    setFormState({ name: "", abv: "", price: "" });
  };

  const handleEdit = (index: number) => {
    const beer = beers[index];
    setEditingIndex(index);
    setFormState({
      name: beer.name,
      abv: beer.abv,
      price: beer.price?.toString() ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    resetBeers();
    setEditingIndex(null);
    setFormState({ name: "", abv: "", price: "" });
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel administrativo</CardTitle>
            <CardDescription>Ingresa para actualizar la lista de cervezas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Correo</Label>
                <Input
                  id="admin-email"
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Contraseña</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button className="w-full" type="submit">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Administrador de cervezas</h1>
            <p className="text-slate-600">
              Añade, edita o elimina cervezas en tiempo real para la página principal.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Plus className="h-5 w-5 text-[#D9A566]" />
              {editingIndex !== null ? "Editar cerveza" : "Agregar nueva cerveza"}
            </CardTitle>
            <CardDescription>
              Completa los datos y presiona guardar para {editingIndex !== null ? "actualizar" : "añadir"} la cerveza.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={handleFormSubmit}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="beer-name">Nombre</Label>
                <Input
                  id="beer-name"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Ej. Bale Breaker..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beer-abv">ABV</Label>
                <Input
                  id="beer-abv"
                  value={formState.abv}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, abv: event.target.value }))
                  }
                  placeholder="Ej. 6.5%"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beer-price">Precio</Label>
                <Input
                  id="beer-price"
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, price: event.target.value }))
                  }
                  placeholder="Ej. 8.5"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-500 md:col-span-3">{formError}</p>
              )}
              <div className="flex gap-3 md:col-span-3">
                <Button type="submit">
                  {editingIndex !== null ? "Guardar cambios" : "Agregar cerveza"}
                </Button>
                {editingIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingIndex(null);
                      setFormState({ name: "", abv: "", price: "" });
                      setFormError("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Listado actual ({beers.length})</CardTitle>
              <CardDescription>Los cambios se reflejan de inmediato en la página de inicio.</CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Restaurar lista original
            </Button>
          </CardHeader>
          <CardContent>
            {beers.length === 0 ? (
              <p className="text-sm text-slate-600">No hay cervezas registradas actualmente.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>ABV</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beers.map((beer, index) => (
                    <TableRow key={`${beer.name}-${index}`}>
                      <TableCell className="font-medium">{beer.name}</TableCell>
                      <TableCell>{beer.abv}</TableCell>
                      <TableCell>
                        {typeof beer.price === "number" ? `$${beer.price.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(index)}
                          aria-label={`Editar ${beer.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBeer(index)}
                          aria-label={`Eliminar ${beer.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPage;
