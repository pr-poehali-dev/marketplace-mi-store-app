import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
  total: number;
  items: CartItem[];
}

interface Notification {
  id: string;
  type: 'order' | 'delivery';
  message: string;
  time: string;
  read: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'delivery',
      message: 'Ваш заказ #12345 отправлен',
      time: '5 мин назад',
      read: false
    },
    {
      id: '2',
      type: 'order',
      message: 'Заказ #12344 доставлен',
      time: '2 часа назад',
      read: false
    },
    {
      id: '3',
      type: 'order',
      message: 'Новая акция: скидка 20%',
      time: 'Вчера',
      read: true
    }
  ]);

  const products: Product[] = [
    {
      id: 1,
      name: 'Смартфон Galaxy X',
      price: 49990,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Электроника',
      badge: 'Хит'
    },
    {
      id: 2,
      name: 'Наушники Pro',
      price: 8990,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Аудио'
    },
    {
      id: 3,
      name: 'Умные часы',
      price: 15990,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: 'Аксессуары',
      badge: 'Новинка'
    },
    {
      id: 4,
      name: 'Ноутбук Ultra',
      price: 79990,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      category: 'Компьютеры'
    },
    {
      id: 5,
      name: 'Камера 4K',
      price: 35990,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      category: 'Фото',
      badge: 'Скидка'
    },
    {
      id: 6,
      name: 'Планшет Tab',
      price: 29990,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      category: 'Электроника'
    }
  ];

  const orders: Order[] = [
    {
      id: '12345',
      date: '20.01.2026',
      status: 'shipped',
      total: 58980,
      items: [
        { ...products[0], quantity: 1 },
        { ...products[1], quantity: 1 }
      ]
    },
    {
      id: '12344',
      date: '15.01.2026',
      status: 'delivered',
      total: 15990,
      items: [{ ...products[2], quantity: 1 }]
    }
  ];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info('Товар удален из корзины');
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: { label: 'В обработке', variant: 'secondary' as const },
      shipped: { label: 'Отправлен', variant: 'default' as const },
      delivered: { label: 'Доставлен', variant: 'outline' as const }
    };
    return variants[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Icon name="Store" className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ми Сторе
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Bell" className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Уведомления</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <Card
                        key={notif.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${!notif.read ? 'border-primary' : ''}`}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${notif.type === 'delivery' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                              <Icon name={notif.type === 'delivery' ? 'Truck' : 'Package'} className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Icon name="ShoppingCart" className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ru-RU')} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Icon name="Minus" className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Icon name="Plus" className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 ml-auto text-destructive"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {cart.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">{cartTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="catalog" className="gap-2">
              <Icon name="Store" className="h-4 w-4" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="Package" className="h-4 w-4" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Icon name="Heart" className="h-4 w-4" />
              Избранное
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6 animate-fade-in">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-secondary shadow-lg">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full group-hover:bg-secondary transition-colors"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Мои заказы</h2>
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge {...getStatusBadge(order.status)} className="text-sm px-3 py-1">
                      {getStatusBadge(order.status).label}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">Итого:</span>
                    <span className="text-xl font-bold text-primary">{order.total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>ИП</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">Иван Петров</h2>
                    <p className="text-muted-foreground">ivan.petrov@example.com</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                    <p className="text-lg">+7 (999) 123-45-67</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Адрес доставки</label>
                    <p className="text-lg">г. Москва, ул. Примерная, д. 10, кв. 25</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">
                      <Icon name="Edit" className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Icon name="Settings" className="mr-2 h-4 w-4" />
                      Настройки
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="animate-fade-in">
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Icon name="Heart" className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Избранное пусто</h3>
              <p className="text-muted-foreground">Добавьте товары в избранное, чтобы не потерять их</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;