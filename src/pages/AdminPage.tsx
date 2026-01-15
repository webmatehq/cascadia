import { useEffect, useRef, useState, type RefObject } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/hooks/useContent";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type {
  BeerItem,
  WineItem,
  WineCategory,
  EventItem,
  UpcomingScheduleItem,
} from "@shared/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type BeerFormState = { id: string | null; name: string; abv: string; price: string };
type WineFormState = {
  id: string | null;
  name: string;
  category: WineCategory;
  glass: string;
  bottle: string;
};
type EventFormState = {
  id: string | null;
  title: string;
  description: string;
  tagline: string;
  date: string;
  time: string;
  location: string;
  highlights: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};
type ScheduleWeekFormState = { weekLabel: string };
type ScheduleItemFormState = { id: string | null; title: string; lines: string };

const initialBeerForm: BeerFormState = { id: null, name: "", abv: "", price: "" };
const initialWineForm: WineFormState = { id: null, name: "", category: "Whites", glass: "", bottle: "" };
const initialEventForm: EventFormState = {
  id: null,
  title: "",
  description: "",
  tagline: "",
  date: "",
  time: "",
  location: "",
  highlights: "",
  backgroundColor: "",
  borderColor: "",
  textColor: "",
};
const initialScheduleWeekForm: ScheduleWeekFormState = { weekLabel: "" };
const initialScheduleItemForm: ScheduleItemFormState = { id: null, title: "", lines: "" };

const COLOR_FALLBACKS = {
  background: "#F5F5F5",
  border: "#E5E5E5",
  text: "#1F2937",
};

const parseHighlightsInput = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseLinesInput = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getColorInputValue = (value: string, fallback: string) =>
  value && /^#[0-9A-Fa-f]{3,6}$/i.test(value) ? value : fallback;

const AdminPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const { data, isLoading, isError, refetch } = useContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [beerForm, setBeerForm] = useState<BeerFormState>(initialBeerForm);
  const [beerError, setBeerError] = useState("");

  const [wineForm, setWineForm] = useState<WineFormState>(initialWineForm);
  const [wineError, setWineError] = useState("");

  const [eventForm, setEventForm] = useState<EventFormState>(initialEventForm);
  const [eventError, setEventError] = useState("");
  const [scheduleWeekForm, setScheduleWeekForm] = useState<ScheduleWeekFormState>(
    initialScheduleWeekForm
  );
  const [scheduleItemForm, setScheduleItemForm] = useState<ScheduleItemFormState>(
    initialScheduleItemForm
  );
  const [scheduleError, setScheduleError] = useState("");
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuUploadError, setMenuUploadError] = useState("");
  const [isUploadingMenu, setIsUploadingMenu] = useState(false);

  const beers = data?.beers ?? [];
  const wines = data?.wines ?? [];
  const events = data?.events ?? [];
  const scheduleWeek = data?.upcomingSchedule;
  const scheduleItems = scheduleWeek?.items ?? [];
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const menuPublicUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/Cascadia/Menu/cascadia-menu.pdf`
    : "";
  const highlightPreview = parseHighlightsInput(eventForm.highlights);
  const beerFormRef = useRef<HTMLFormElement>(null);
  const wineFormRef = useRef<HTMLFormElement>(null);
  const eventFormRef = useRef<HTMLFormElement>(null);
  const scheduleFormRef = useRef<HTMLFormElement>(null);

  const isPending = (action: string) => pendingAction === action;

  useEffect(() => {
    if (scheduleWeek?.weekLabel) {
      setScheduleWeekForm({ weekLabel: scheduleWeek.weekLabel });
    }
  }, [scheduleWeek?.weekLabel]);

  const runAction = async (
    action: string,
    method: string,
    url: string,
    payload?: unknown,
    successMessage?: string
  ) => {
    setPendingAction(action);
    try {
      await apiRequest(method, url, payload);
      await queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      if (successMessage) {
        toast({ title: successMessage });
      }
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al guardar",
        description: "Ocurrió un problema al intentar guardar los cambios. Intenta otra vez.",
        variant: "destructive",
      });
      return false;
    } finally {
      setPendingAction(null);
    }
  };

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

  const handleBeerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!beerForm.name.trim() || !beerForm.abv.trim()) {
      setBeerError("Completa el nombre y el ABV.");
      return;
    }
    const priceValue = beerForm.price.trim();
    if (!priceValue) {
      setBeerError("El precio es obligatorio.");
      return;
    }
    const price = Number(priceValue);
    if (Number.isNaN(price)) {
      setBeerError("El precio debe ser un número válido.");
      return;
    }
    setBeerError("");
    const payload = {
      name: beerForm.name.trim(),
      abv: beerForm.abv.trim(),
      price,
    };
    const action = beerForm.id ? "update-beer" : "create-beer";
    const method = beerForm.id ? "PUT" : "POST";
    const url = beerForm.id ? `/api/admin/beers/${beerForm.id}` : "/api/admin/beers";
    const success = await runAction(action, method, url, payload, "Lista de cervezas actualizada");
    if (success) {
      setBeerForm(initialBeerForm);
    }
  };

  const handleWineSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wineForm.name.trim()) {
      setWineError("El nombre es obligatorio.");
      return;
    }
    const glassValue = wineForm.glass.trim();
    const bottleValue = wineForm.bottle.trim();
    const glass = glassValue ? Number(glassValue) : undefined;
    const bottle = bottleValue ? Number(bottleValue) : undefined;
    if ((glassValue && Number.isNaN(glass)) || (bottleValue && Number.isNaN(bottle))) {
      setWineError("Los precios deben ser números válidos.");
      return;
    }
    setWineError("");
    const payload = {
      name: wineForm.name.trim(),
      category: wineForm.category,
      glass,
      bottle,
    };
    const action = wineForm.id ? "update-wine" : "create-wine";
    const method = wineForm.id ? "PUT" : "POST";
    const url = wineForm.id ? `/api/admin/wines/${wineForm.id}` : "/api/admin/wines";
    const success = await runAction(action, method, url, payload, "Lista de vinos actualizada");
    if (success) {
      setWineForm(initialWineForm);
    }
  };

  const handleEventSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.location.trim()) {
      setEventError("Completa el título, la fecha y la ubicación.");
      return;
    }
    const highlights = highlightPreview;
    setEventError("");
    const payload = {
      title: eventForm.title.trim(),
      description: eventForm.description.trim() || undefined,
      tagline: eventForm.tagline.trim() || undefined,
      date: eventForm.date.trim(),
      time: eventForm.time.trim() || undefined,
      location: eventForm.location.trim(),
      highlights,
      backgroundColor: eventForm.backgroundColor.trim() || undefined,
      borderColor: eventForm.borderColor.trim() || undefined,
      textColor: eventForm.textColor.trim() || undefined,
    };
    const action = eventForm.id ? "update-event" : "create-event";
    const method = eventForm.id ? "PUT" : "POST";
    const url = eventForm.id ? `/api/admin/events/${eventForm.id}` : "/api/admin/events";
    const success = await runAction(action, method, url, payload, "Eventos actualizados");
    if (success) {
      setEventForm(initialEventForm);
    }
  };

  const handleScheduleWeekSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scheduleWeekForm.weekLabel.trim()) {
      setScheduleError("Completa el texto de la semana.");
      return;
    }
    setScheduleError("");
    const payload = { weekLabel: scheduleWeekForm.weekLabel.trim() };
    await runAction("update-schedule-week", "PUT", "/api/admin/upcoming-schedule/week", payload, "Schedule actualizado");
  };

  const handleScheduleItemSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scheduleItemForm.title.trim()) {
      setScheduleError("Completa el título del bloque.");
      return;
    }
    const lines = parseLinesInput(scheduleItemForm.lines);
    setScheduleError("");
    const payload = {
      title: scheduleItemForm.title.trim(),
      lines,
    };
    const action = scheduleItemForm.id ? "update-schedule-item" : "create-schedule-item";
    const method = scheduleItemForm.id ? "PUT" : "POST";
    const url = scheduleItemForm.id
      ? `/api/admin/upcoming-schedule/items/${scheduleItemForm.id}`
      : "/api/admin/upcoming-schedule/items";
    const success = await runAction(action, method, url, payload, "Schedule actualizado");
    if (success) {
      setScheduleItemForm(initialScheduleItemForm);
    }
  };

  const scrollToSection = (ref: RefObject<HTMLFormElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleColorChange = (
    field: "backgroundColor" | "borderColor" | "textColor",
    value: string
  ) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderColorPicker = (
    label: string,
    field: "backgroundColor" | "borderColor" | "textColor",
    fallback: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={getColorInputValue(eventForm[field], fallback)}
          onChange={(event) => handleColorChange(field, event.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-0"
        />
        <span className="text-sm font-mono text-gray-600">
          {eventForm[field] || "Automático"}
        </span>
        {eventForm[field] && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleColorChange(field, "")}
            className="text-muted-foreground"
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );

  const handleBeerEdit = (beer: BeerItem) => {
    setBeerForm({
      id: beer.id,
      name: beer.name,
      abv: beer.abv,
      price: beer.price?.toString() ?? "",
    });
    scrollToSection(beerFormRef);
  };

  const handleWineEdit = (wine: WineItem) => {
    setWineForm({
      id: wine.id,
      name: wine.name,
      category: wine.category,
      glass: wine.glass?.toString() ?? "",
      bottle: wine.bottle?.toString() ?? "",
    });
    scrollToSection(wineFormRef);
  };

  const handleEventEdit = (eventItem: EventItem) => {
    setEventForm({
      id: eventItem.id,
      title: eventItem.title,
      description: eventItem.description ?? "",
      tagline: eventItem.tagline ?? "",
      date: eventItem.date,
      time: eventItem.time ?? "",
      location: eventItem.location,
      highlights: eventItem.highlights.join("\n"),
      backgroundColor: eventItem.backgroundColor ?? "",
      borderColor: eventItem.borderColor ?? "",
      textColor: eventItem.textColor ?? "",
    });
    scrollToSection(eventFormRef);
  };

  const handleScheduleItemEdit = (item: UpcomingScheduleItem) => {
    setScheduleItemForm({
      id: item.id,
      title: item.title,
      lines: item.lines.join("\n"),
    });
    scrollToSection(scheduleFormRef);
  };

  const handleDeleteBeer = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta cerveza?")) return;
    await runAction(`delete-beer-${id}`, "DELETE", `/api/admin/beers/${id}`, undefined, "Cerveza eliminada");
    if (beerForm.id === id) {
      setBeerForm(initialBeerForm);
    }
  };

  const handleDeleteWine = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este vino?")) return;
    await runAction(`delete-wine-${id}`, "DELETE", `/api/admin/wines/${id}`, undefined, "Vino eliminado");
    if (wineForm.id === id) {
      setWineForm(initialWineForm);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;
    await runAction(`delete-event-${id}`, "DELETE", `/api/admin/events/${id}`, undefined, "Evento eliminado");
    if (eventForm.id === id) {
      setEventForm(initialEventForm);
    }
  };

  const handleDeleteScheduleItem = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este bloque del schedule?")) return;
    await runAction(
      `delete-schedule-item-${id}`,
      "DELETE",
      `/api/admin/upcoming-schedule/items/${id}`,
      undefined,
      "Schedule actualizado"
    );
    if (scheduleItemForm.id === id) {
      setScheduleItemForm(initialScheduleItemForm);
    }
  };

  const handleResetBeers = async () => {
    await runAction("reset-beers", "POST", "/api/admin/beers/reset", undefined, "Lista de cervezas restaurada");
    setBeerForm(initialBeerForm);
  };

  const handleResetWines = async () => {
    await runAction("reset-wines", "POST", "/api/admin/wines/reset", undefined, "Lista de vinos restaurada");
    setWineForm(initialWineForm);
  };

  const handleResetEvents = async () => {
    await runAction("reset-events", "POST", "/api/admin/events/reset", undefined, "Eventos restaurados");
    setEventForm(initialEventForm);
  };

  const handleResetSchedule = async () => {
    await runAction(
      "reset-schedule",
      "POST",
      "/api/admin/upcoming-schedule/reset",
      undefined,
      "Schedule restaurado"
    );
    setScheduleItemForm(initialScheduleItemForm);
  };

  const handleMenuUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!menuFile) {
      setMenuUploadError("Selecciona un PDF antes de subirlo.");
      return;
    }
    if (menuFile.type !== "application/pdf") {
      setMenuUploadError("El archivo debe ser un PDF.");
      return;
    }
    setMenuUploadError("");
    setIsUploadingMenu(true);
    try {
      const response = await fetch("/api/admin/menu-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
        body: menuFile,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message ?? "No se pudo subir el PDF.");
      }

      toast({ title: "Menú actualizado", description: "El PDF fue reemplazado correctamente." });
      setMenuFile(null);
    } catch (error) {
      console.error(error);
      setMenuUploadError("Ocurrió un error al subir el menú. Intenta otra vez.");
    } finally {
      setIsUploadingMenu(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Panel administrativo</CardTitle>
            <CardDescription>Ingresa para actualizar el contenido.</CardDescription>
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

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card>
          <CardContent className="p-8">
            <p className="text-lg text-slate-700">Cargando el contenido actual...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>No pudimos cargar los datos</CardTitle>
            <CardDescription>Revisa tu conexión e intenta nuevamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Panel administrativo</h1>
            <p className="text-slate-600">Gestiona cervezas, vinos y eventos en un solo lugar.</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>

        {/* Beer management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Plus className="h-5 w-5 text-[#D9A566]" />
              {beerForm.id ? "Editar cerveza" : "Agregar nueva cerveza"}
            </CardTitle>
            <CardDescription>Actualiza la rotación de cervezas en minutos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={beerFormRef} className="grid gap-4 md:grid-cols-3" onSubmit={handleBeerSubmit}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="beer-name">Nombre</Label>
                <Input
                  id="beer-name"
                  value={beerForm.name}
                  onChange={(event) => setBeerForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ej. Bale Breaker..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beer-abv">ABV</Label>
                <Input
                  id="beer-abv"
                  value={beerForm.abv}
                  onChange={(event) => setBeerForm((prev) => ({ ...prev, abv: event.target.value }))}
                  placeholder="Ej. 6.5%"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beer-price">Precio</Label>
                <Input
                  id="beer-price"
                  value={beerForm.price}
                  onChange={(event) => setBeerForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="Ej. 8.5"
                />
              </div>
              {beerError && <p className="text-sm text-red-500 md:col-span-3">{beerError}</p>}
              <div className="flex gap-3 md:col-span-3">
                <Button type="submit" disabled={isPending("create-beer") || isPending("update-beer")}>
                  {beerForm.id ? "Guardar cambios" : "Agregar cerveza"}
                </Button>
                {beerForm.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setBeerForm(initialBeerForm);
                      setBeerError("");
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
              <CardTitle>Listado de cervezas ({beers.length})</CardTitle>
              <CardDescription>Los cambios se reflejan de inmediato en la página principal.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetBeers}
              className="gap-2"
              disabled={isPending("reset-beers")}
            >
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
                  {beers.map((beer) => (
                    <TableRow key={beer.id}>
                      <TableCell className="font-medium">{beer.name}</TableCell>
                      <TableCell>{beer.abv}</TableCell>
                      <TableCell>
                        {typeof beer.price === "number" ? `$${beer.price.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBeerEdit(beer)}
                          aria-label={`Editar ${beer.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBeer(beer.id)}
                          aria-label={`Eliminar ${beer.name}`}
                          disabled={isPending(`delete-beer-${beer.id}`)}
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

        {/* Wine management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Plus className="h-5 w-5 text-[#D9A566]" />
              {wineForm.id ? "Editar vino" : "Agregar vino"}
            </CardTitle>
            <CardDescription>Mantén actualizada la selección de botellas y copas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={wineFormRef} className="grid gap-4 md:grid-cols-2" onSubmit={handleWineSubmit}>
              <div className="space-y-2">
                <Label htmlFor="wine-name">Nombre</Label>
                <Input
                  id="wine-name"
                  value={wineForm.name}
                  onChange={(event) => setWineForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ej. Silver Bell Sauv Blanc"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wine-category">Categoría</Label>
                <select
                  id="wine-category"
                  value={wineForm.category}
                  onChange={(event) =>
                    setWineForm((prev) => ({ ...prev, category: event.target.value as WineCategory }))
                  }
                  className="border border-input bg-background px-3 py-2 rounded-md text-sm"
                >
                  <option value="Whites">Whites</option>
                  <option value="Rosé">Rosé</option>
                  <option value="Reds">Reds</option>
                  <option value="Wine Cocktails">Wine Cocktails</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wine-glass">Precio por copa</Label>
                <Input
                  id="wine-glass"
                  value={wineForm.glass}
                  onChange={(event) => setWineForm((prev) => ({ ...prev, glass: event.target.value }))}
                  placeholder="Ej. 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wine-bottle">Precio botella</Label>
                <Input
                  id="wine-bottle"
                  value={wineForm.bottle}
                  onChange={(event) => setWineForm((prev) => ({ ...prev, bottle: event.target.value }))}
                  placeholder="Ej. 30"
                />
              </div>
              {wineError && <p className="text-sm text-red-500 md:col-span-2">{wineError}</p>}
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" disabled={isPending("create-wine") || isPending("update-wine")}>
                  {wineForm.id ? "Guardar vino" : "Agregar vino"}
                </Button>
                {wineForm.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setWineForm(initialWineForm);
                      setWineError("");
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
              <CardTitle>Vinos disponibles ({wines.length})</CardTitle>
              <CardDescription>Organiza por categoría y precios.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetWines}
              className="gap-2"
              disabled={isPending("reset-wines")}
            >
              <RefreshCw className="h-4 w-4" />
              Restaurar vinos originales
            </Button>
          </CardHeader>
          <CardContent>
            {wines.length === 0 ? (
              <p className="text-sm text-slate-600">No hay vinos registrados.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Copa</TableHead>
                    <TableHead>Botella</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wines.map((wine) => (
                    <TableRow key={wine.id}>
                      <TableCell className="font-medium">{wine.name}</TableCell>
                      <TableCell>{wine.category}</TableCell>
                      <TableCell>
                        {typeof wine.glass === "number" ? `$${wine.glass.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell>
                        {typeof wine.bottle === "number" ? `$${wine.bottle.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleWineEdit(wine)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWine(wine.id)}
                          disabled={isPending(`delete-wine-${wine.id}`)}
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

        {/* Events management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Plus className="h-5 w-5 text-[#D9A566]" />
              {eventForm.id ? "Editar evento" : "Agregar evento"}
            </CardTitle>
            <CardDescription>Publica tus activaciones y actividades especiales.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={eventFormRef} className="grid gap-4" onSubmit={handleEventSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Título</Label>
                  <Input
                    id="event-title"
                    value={eventForm.title}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-tagline">Tagline</Label>
                  <Input
                    id="event-tagline"
                    value={eventForm.tagline}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, tagline: event.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Fecha</Label>
                  <Input
                    id="event-date"
                    value={eventForm.date}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
                    placeholder="Ej. Saturday, October 25th"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time">Horario</Label>
                  <Input
                    id="event-time"
                    value={eventForm.time}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, time: event.target.value }))}
                    placeholder="Ej. Noon – 4 PM"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Ubicación</Label>
                <Input
                  id="event-location"
                  value={eventForm.location}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="Dirección o descripción corta"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Descripción</Label>
                <Textarea
                  id="event-description"
                  value={eventForm.description}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Texto introductorio opcional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-highlights">Highlights (uno por línea)</Label>
                <Textarea
                  id="event-highlights"
                  value={eventForm.highlights}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, highlights: event.target.value }))}
                  placeholder="Premios, actividades, promociones..."
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {renderColorPicker("Color de fondo", "backgroundColor", COLOR_FALLBACKS.background)}
                {renderColorPicker("Color del borde", "borderColor", COLOR_FALLBACKS.border)}
                {renderColorPicker("Color del texto", "textColor", COLOR_FALLBACKS.text)}
              </div>
              {eventError && <p className="text-sm text-red-500">{eventError}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={isPending("create-event") || isPending("update-event")}>
                  {eventForm.id ? "Guardar evento" : "Agregar evento"}
                </Button>
                {eventForm.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEventForm(initialEventForm);
                      setEventError("");
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
              <CardTitle>Eventos publicados ({events.length})</CardTitle>
              <CardDescription>Estos eventos se muestran en el carrusel de la página principal.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetEvents}
              className="gap-2"
              disabled={isPending("reset-events")}
            >
              <RefreshCw className="h-4 w-4" />
              Restaurar eventos originales
            </Button>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-slate-600">Todavía no hay eventos.</p>
            ) : (
              <div className="grid gap-4">
                {events.map((eventItem) => {
                  const isEditingThisEvent = eventForm.id === eventItem.id;
                  const previewHighlights = isEditingThisEvent ? highlightPreview : eventItem.highlights;
                  const previewBackground = isEditingThisEvent
                    ? eventForm.backgroundColor || eventItem.backgroundColor || COLOR_FALLBACKS.background
                    : eventItem.backgroundColor ?? COLOR_FALLBACKS.background;
                  const previewBorder = isEditingThisEvent
                    ? eventForm.borderColor || eventItem.borderColor || COLOR_FALLBACKS.border
                    : eventItem.borderColor ?? COLOR_FALLBACKS.border;
                  const previewText = isEditingThisEvent
                    ? eventForm.textColor || eventItem.textColor || COLOR_FALLBACKS.text
                    : eventItem.textColor ?? COLOR_FALLBACKS.text;
                  const previewTitle = isEditingThisEvent ? eventForm.title || eventItem.title : eventItem.title;
                  const previewTagline = isEditingThisEvent ? eventForm.tagline : eventItem.tagline;
                  const previewDescription = isEditingThisEvent ? eventForm.description : eventItem.description;
                  const previewDate = isEditingThisEvent ? eventForm.date : eventItem.date;
                  const previewTime = isEditingThisEvent ? eventForm.time : eventItem.time;
                  const previewLocation = isEditingThisEvent ? eventForm.location : eventItem.location;

                  return (
                    <div
                      key={eventItem.id}
                      className="border rounded-lg p-4 flex flex-col gap-2 bg-white"
                      style={{
                        borderColor: previewBorder,
                        background: previewBackground,
                        color: previewText,
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm uppercase tracking-wide opacity-80">{previewDate}</p>
                        <h3 className="text-xl font-semibold">{previewTitle}</h3>
                        {previewTagline && (
                          <p className="text-sm italic opacity-80">{previewTagline}</p>
                        )}
                        {previewDescription && (
                          <p className="text-sm opacity-80">{previewDescription}</p>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{previewLocation}</p>
                        {previewTime && <p>{previewTime}</p>}
                      </div>
                      {previewHighlights.length > 0 && (
                        <ul className="list-disc list-inside text-sm opacity-90">
                          {previewHighlights.map((highlight, idx) => (
                            <li key={`${eventItem.id}-summary-${idx}`}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-2 self-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEventEdit(eventItem)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(eventItem.id)}
                          disabled={isPending(`delete-event-${eventItem.id}`)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Upcoming Schedule</CardTitle>
              <CardDescription>Actualiza la semana y los bloques del schedule.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetSchedule}
              className="gap-2"
              disabled={isPending("reset-schedule")}
            >
              <RefreshCw className="h-4 w-4" />
              Restaurar schedule
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form
              className="grid gap-4 md:grid-cols-[1fr_auto]"
              onSubmit={handleScheduleWeekSubmit}
            >
              <div className="space-y-2">
                <Label htmlFor="schedule-week-label">Texto de la semana</Label>
                <Input
                  id="schedule-week-label"
                  value={scheduleWeekForm.weekLabel}
                  onChange={(event) =>
                    setScheduleWeekForm((prev) => ({ ...prev, weekLabel: event.target.value }))
                  }
                  placeholder="Week of 1/12 to 1/18"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isPending("update-schedule-week")}>
                  Guardar semana
                </Button>
              </div>
            </form>

            <form ref={scheduleFormRef} className="grid gap-4" onSubmit={handleScheduleItemSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule-title">Título del bloque</Label>
                  <Input
                    id="schedule-title"
                    value={scheduleItemForm.title}
                    onChange={(event) =>
                      setScheduleItemForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Ej. Thursday, 15th"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-lines">Líneas (una por línea)</Label>
                  <Textarea
                    id="schedule-lines"
                    value={scheduleItemForm.lines}
                    onChange={(event) =>
                      setScheduleItemForm((prev) => ({ ...prev, lines: event.target.value }))
                    }
                    placeholder="Trades Appreciation Day 5pm-8pm"
                  />
                </div>
              </div>
              {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isPending("create-schedule-item") || isPending("update-schedule-item")}
                >
                  {scheduleItemForm.id ? "Guardar bloque" : "Agregar bloque"}
                </Button>
                {scheduleItemForm.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setScheduleItemForm(initialScheduleItemForm);
                      setScheduleError("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Bloques publicados ({scheduleItems.length})
              </p>
              {scheduleItems.length === 0 ? (
                <p className="text-sm text-slate-600">Todavía no hay bloques en el schedule.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Detalle</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          {item.lines.length === 0 ? "—" : item.lines.join(" · ")}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleScheduleItemEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteScheduleItem(item.id)}
                            disabled={isPending(`delete-schedule-item-${item.id}`)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subir menú en PDF</CardTitle>
            <CardDescription>
              Reemplaza el archivo existente en Supabase Storage con el nuevo menú.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={handleMenuUpload}>
              <div className="space-y-2">
                <Label htmlFor="menu-pdf">Archivo PDF</Label>
                <Input
                  id="menu-pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setMenuFile(file);
                    setMenuUploadError("");
                  }}
                />
                {menuFile && (
                  <p className="text-sm text-slate-600">Seleccionado: {menuFile.name}</p>
                )}
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isUploadingMenu}>
                  {isUploadingMenu ? "Subiendo..." : "Subir y reemplazar"}
                </Button>
              </div>
              {menuUploadError && <p className="text-sm text-red-500 md:col-span-2">{menuUploadError}</p>}
            </form>
            {menuPublicUrl && (
              <p className="text-sm text-slate-600 mt-4">
                URL pública actual:{" "}
                <a
                  href={menuPublicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {menuPublicUrl}
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPage;
