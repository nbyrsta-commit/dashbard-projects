import { useMemo, useState } from "react";
import "./App.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "موجود" | "کم‌موجود" | "ناموجود";
};

type Page = "نمای کلی" | "محصولات" | "سفارش‌ها" | "مشتریان" | "گزارش‌ها";

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "در انتظار پرداخت" | "در حال آماده‌سازی" | "ارسال‌شده" | "تحویل‌شده";
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
};

const navItems = [
  ["نمای کلی", "◫"],
  ["محصولات", "▤"],
  ["سفارش‌ها", "▧"],
  ["مشتریان", "♙"],
  ["گزارش‌ها", "▥"],
] as const;

const initialOrders: Order[] = [
  { id: "NS-1048", customer: "سارا محمدی", date: "۱۴۰۵/۰۷/۲۵", total: 1730000, status: "در انتظار پرداخت" },
  { id: "NS-1047", customer: "نگار احمدی", date: "۱۴۰۵/۰۷/۲۴", total: 910000, status: "در حال آماده‌سازی" },
  { id: "NS-1046", customer: "هلیا رضایی", date: "۱۴۰۵/۰۷/۲۴", total: 2450000, status: "ارسال‌شده" },
  { id: "NS-1045", customer: "آوا کریمی", date: "۱۴۰۵/۰۷/۲۳", total: 680000, status: "تحویل‌شده" },
];

const initialCustomers: Customer[] = [
  { id: 1, name: "سارا محمدی", phone: "۰۹۱۲۱۲۳۴۵۶۷", orders: 8, totalSpent: 6250000 },
  { id: 2, name: "نگار احمدی", phone: "۰۹۳۵۱۲۳۴۵۶۷", orders: 5, totalSpent: 3840000 },
  { id: 3, name: "هلیا رضایی", phone: "۰۹۱۴۱۲۳۴۵۶۷", orders: 3, totalSpent: 2910000 },
  { id: 4, name: "آوا کریمی", phone: "۰۹۹۰۱۲۳۴۵۶۷", orders: 2, totalSpent: 1420000 },
];

const initialProducts: Product[] = [
  { id: 1, name: "کرم مرطوب‌کننده", category: "مراقبت پوست", price: 480000, stock: 24, status: "موجود" },
  { id: 2, name: "عطر وانیل", category: "عطر و ادکلن", price: 1250000, stock: 5, status: "کم‌موجود" },
  { id: 3, name: "شمع معطر", category: "دکوراسیون", price: 320000, stock: 18, status: "موجود" },
  { id: 4, name: "روغن آرگان", category: "مراقبت مو", price: 590000, stock: 0, status: "ناموجود" },
  { id: 5, name: "بالم لب", category: "مراقبت پوست", price: 185000, stock: 8, status: "موجود" },
];

const sales = [35, 52, 42, 68, 48, 78, 60, 88, 70, 95, 73, 100];

const money = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState<Page>("نمای کلی");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  function changeStock(id: number) {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) return product;

        const stock = product.stock + 1;

        return {
          ...product,
          stock,
          status: stock === 0 ? "ناموجود" : stock < 7 ? "کم‌موجود" : "موجود",
        };
      })
    );
  }

  return (
    <div className="app-shell flex flex-col md:flex-row min-h-screen" dir="rtl">
      <aside className="sidebar w-full md:w-64 border-b md:border-b-0 md:border-l border-gray-200 p-4 shrink-0">
        <a className="brand" href="#home">
          <span className="brand-icon">n.</span>
          <span>
            <strong>nude studio</strong>
            <small>پنل مدیریت فروشگاه</small>
          </span>
        </a>

        <div className="sidebar-label">منوی اصلی</div>

        <nav className="nav-list">
          {navItems.map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => setActivePage(label)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
              {label === "سفارش‌ها" && <span className="nav-badge">4</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-sparkle">✳</span>
            <strong>همه‌چیز مرتبه؟</strong>
            <p>فروشگاهت رو با آرامش مدیریت کن.</p>
            <button onClick={() => alert("بخش راهنما به‌زودی اضافه می‌شود.")}>
              راهنمای پنل ↗
            </button>
          </div>

          <div className="profile">
            <div className="avatar">ن</div>
            <div className="profile-info">
              <strong>مدیر فروشگاه</strong>
              <small>مدیر کل</small>
            </div>
            <span className="profile-more">•••</span>
          </div>
        </div>
      </aside>

<main className="main-content flex-1 p-4 w-full overflow-hidden" id="home">
        <header className="topbar">
          <div className="breadcrumb">
            <span>فروشگاه</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <span className="today">✳ روز خوبی داشته باشی!</span>
            <button
              className="icon-button"
              aria-label="اعلان‌ها"
              onClick={() => alert("فعلاً اعلان جدیدی نداری.")}
            >
              ♧
              <i />
            </button>
            <button
              className="add-button"
              onClick={() => setActivePage("محصولات")}
            >
              <span>＋</span> مشاهده محصولات
            </button>
          </div>
        </header>

        {activePage === "نمای کلی" && (
          <>
        <section className="welcome-section">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              فضای مدیریت شما
            </div>
            <h1>
              سلام، خوش اومدی <span>✳</span>
            </h1>
            <p>یک نگاه به وضعیت فروشگاهت بنداز و روزت رو شروع کن.</p>
          </div>

          <div className="date-card">
            <span>امروز</span>
            <strong>
              {new Intl.DateTimeFormat("fa-IR", {
                dateStyle: "medium",
              }).format(new Date())}
            </strong>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card featured">
            <div className="stat-top">
              <span className="stat-icon">↗</span>
              <span className="stat-caption">در این ماه</span>
            </div>
            <p>فروش کل</p>
            <h2>۲۴,۸۵۰,۰۰۰ <small>تومان</small></h2>
            <div className="stat-footer">
              <span className="trend">↗ ۱۲.۸٪</span>
              <span>نسبت به ماه قبل</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">▧</span>
              <span className="stat-caption">این ماه</span>
            </div>
            <p>سفارش‌ها</p>
            <h2>۱۲۸</h2>
            <div className="stat-footer">
              <span className="trend">↗ ۸.۲٪</span>
              <span>نسبت به ماه قبل</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">♙</span>
              <span className="stat-caption">مجموع</span>
            </div>
            <p>مشتریان</p>
            <h2>۸۶۴</h2>
            <div className="stat-footer">
              <span className="trend">↗ ۵.۴٪</span>
              <span>نسبت به ماه قبل</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">▤</span>
              <span className="stat-caption">موجودی فعلی</span>
            </div>
            <p>تعداد کالاها</p>
            <h2>{new Intl.NumberFormat("fa-IR").format(totalStock)}</h2>
            <div className="stat-footer">
              <span className="neutral-trend">{products.length} محصول</span>
              <span>در فهرست فعلی</span>
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h3>گزارش فروش</h3>
                <p>نگاهی به روند فروش در طول سال</p>
              </div>
              <button
                className="select-button"
                onClick={() => alert("نمایش اطلاعات ۱۲ ماه اخیر")}
              >
                ۱۲ ماه اخیر⌄
              </button>
            </div>

            <div className="chart-summary">
              <strong>۲۴,۸۵۰,۰۰۰ <small>تومان</small></strong>
              <span className="chart-growth">↗ ۱۲.۸٪</span>
            </div>

            <div className="chart">
              <div className="chart-grid-lines">
                <span>۱۰۰</span>
                <span>۷۵</span>
                <span>۵۰</span>
                <span>۲۵</span>
                <span>۰</span>
              </div>

              <div className="chart-bars">
                {sales.map((value, index) => (
                  <div className="bar-column" key={index}>
                    <div
                      className={`bar ${index === 11 ? "bar-highlight" : ""}`}
                      style={{ height: `${value}%`}}
                      title={`مقدار نسبی فروش: ${value}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-months">
              {["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"].map(
                (month) => <span key={month}>{month}</span>
              )}
            </div>
          </article>

          <article className="panel inventory-panel">
            <div className="panel-heading">
              <div>
                <h3>وضعیت موجودی</h3>
                <p>بررسی سریع انبار</p>
              </div>
              <span className="inventory-symbol">◉</span>
            </div>

            <div className="inventory-ring">
              <div className="ring-center">
                <strong>{new Intl.NumberFormat("fa-IR").format(totalStock)}</strong>
                <span>عدد کالا</span>
              </div>
            </div>

            <div className="inventory-legend">
              <div>
                <span className="legend-dot available" />
                <span>موجود</span>
                <strong>
                  {new Intl.NumberFormat("fa-IR").format(
                    products.filter((p) => p.stock >= 7).length
                  )}
                </strong>
              </div>
              <div>
                <span className="legend-dot low" />
                <span>موجودی کم</span>
                <strong>
                  {new Intl.NumberFormat("fa-IR").format(
                    products.filter((p) => p.stock > 0 && p.stock < 7).length
                  )}
                </strong>
              </div>
              <div>
                <span className="legend-dot unavailable" />
                <span>ناموجود</span>
                <strong>
                  {new Intl.NumberFormat("fa-IR").format(
                    products.filter((p) => p.stock === 0).length
                  )}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="panel products-panel" id="products">
          <div className="panel-heading products-heading">
            <div>
              <h3>محصولات فروشگاه</h3>
              <p>مدیریت و بررسی موجودی محصولات</p>
            </div>

            <label className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی محصول..."
                aria-label="جست‌وجوی محصول"
              />
            </label>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>نام محصول</th>
                  <th>دسته‌بندی</th>
                  <th>قیمت</th>
                  <th>موجودی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-name">
                        <span className={`product-thumb thumb-${product.id}`}>
                          {["✳", "✧", "◈", "❋", "♡"][product.id - 1]}
                        </span>
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td className="muted-cell">{product.category}</td>
                    <td>{money(product.price)}</td>
                    <td>{new Intl.NumberFormat("fa-IR").format(product.stock)}</td>
                    <td>
                      <span
                        className={`status status-${
                          product.stock === 0
                            ? "out"
                            : product.stock < 7
                              ? "low"
                              : "in"
                        }`}
                      >
                        <i />
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="row-action"
                        onClick={() => changeStock(product.id)}
                        title="افزایش موجودی"
                        aria-label={`افزایش موجودی ${product.name}`}
                      >
                        ＋
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      محصولی با این نام پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              نمایش {new Intl.NumberFormat("fa-IR").format(filteredProducts.length)} محصول
            </span>
            <span>اطلاعات نمونه</span>
          </div>
        </section>

          </>
        )}

        {activePage === "محصولات" && (
          <section className="page-section">
            <div className="welcome-section">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> مدیریت فروشگاه</div>
                <h1>محصولات <span>✳</span></h1>
                <p>فهرست کالاها، قیمت‌ها و موجودی انبار را مدیریت کن.</p>
              </div>
              <div className="date-card"><span>تعداد محصولات</span><strong>{new Intl.NumberFormat("fa-IR").format(products.length)}</strong></div>
            </div>
                    <section className="panel products-panel" id="products">
          <div className="panel-heading products-heading">
            <div>
              <h3>محصولات فروشگاه</h3>
              <p>مدیریت و بررسی موجودی محصولات</p>
            </div>

            <label className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی محصول..."
                aria-label="جست‌وجوی محصول"
              />
            </label>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>نام محصول</th>
                  <th>دسته‌بندی</th>
                  <th>قیمت</th>
                  <th>موجودی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-name">
                        <span className={`product-thumb thumb-${product.id}`}>
                          {["✳", "✧", "◈", "❋", "♡"][product.id - 1]}
                        </span>
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td className="muted-cell">{product.category}</td>
                    <td>{money(product.price)}</td>
                    <td>{new Intl.NumberFormat("fa-IR").format(product.stock)}</td>
                    <td>
                      <span
                        className={`status status-${
                          product.stock === 0
                            ? "out"
                            : product.stock < 7
                              ? "low"
                              : "in"
                        }`}
                      >
                        <i />
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="row-action"
                        onClick={() => changeStock(product.id)}
                        title="افزایش موجودی"
                        aria-label={`افزایش موجودی ${product.name}`}
                      >
                        ＋
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      محصولی با این نام پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              نمایش {new Intl.NumberFormat("fa-IR").format(filteredProducts.length)} محصول
            </span>
            <span>اطلاعات نمونه</span>
          </div>
        </section>
          </section>
        )}

        {activePage === "سفارش‌ها" && (
          <section className="page-section">
            <div className="welcome-section">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> مدیریت فروشگاه</div>
                <h1>سفارش‌ها <span>✳</span></h1>
                <p>وضعیت سفارش‌های اخیر فروشگاه را بررسی کن.</p>
              </div>
              <div className="date-card"><span>کل سفارش‌های نمونه</span><strong>{new Intl.NumberFormat("fa-IR").format(initialOrders.length)}</strong></div>
            </div>
            <section className="panel products-panel">
              <div className="panel-heading products-heading">
                <div><h3>فهرست سفارش‌ها</h3><p>این اطلاعات نمونه هستند و از سرور دریافت نمی‌شوند.</p></div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>شماره سفارش</th><th>مشتری</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
                  <tbody>
                    {initialOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{money(order.total)}</td>
                        <td><span className={`status ${order.status === "تحویل‌شده" ? "status-in" : order.status === "ارسال‌شده" ? "status-low" : "status-out"}`}><i />{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer"><span>نمایش {new Intl.NumberFormat("fa-IR").format(initialOrders.length)} سفارش</span><span>اطلاعات نمونه</span></div>
            </section>
          </section>
        )}

        {activePage === "مشتریان" && (
          <section className="page-section">
            <div className="welcome-section">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> مدیریت فروشگاه</div>
                <h1>مشتریان <span>✳</span></h1>
                <p>مشتریان و خلاصه خریدهای آن‌ها را مشاهده کن.</p>
              </div>
              <div className="date-card"><span>مشتریان نمونه</span><strong>{new Intl.NumberFormat("fa-IR").format(initialCustomers.length)}</strong></div>
            </div>
            <section className="panel products-panel">
              <div className="panel-heading products-heading">
                <div><h3>فهرست مشتریان</h3><p>اطلاعات تماس و خرید مشتریان نمونه</p></div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>نام مشتری</th><th>شماره تماس</th><th>تعداد سفارش</th><th>مجموع خرید</th></tr></thead>
                  <tbody>
                    {initialCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td><div className="product-name"><span className={`product-thumb thumb-${customer.id}`}>{customer.name.slice(0, 1)}</span><strong>{customer.name}</strong></div></td>
                        <td>{customer.phone}</td>
                        <td>{new Intl.NumberFormat("fa-IR").format(customer.orders)}</td>
                        <td>{money(customer.totalSpent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer"><span>نمایش {new Intl.NumberFormat("fa-IR").format(initialCustomers.length)} مشتری</span><span>اطلاعات نمونه</span></div>
            </section>
          </section>
        )}

        {activePage === "گزارش‌ها" && (
          <section className="page-section">
            <div className="welcome-section">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> تحلیل عملکرد</div>
                <h1>گزارش‌های فروش <span>✳</span></h1>
                <p>مروری بر آمار نمایشی فروشگاه در طول سال.</p>
              </div>
              <div className="date-card"><span>دوره گزارش</span><strong>۱۲ ماه اخیر</strong></div>
            </div>
            <section className="stats-grid">
              <article className="stat-card featured"><div className="stat-top"><span className="stat-icon">↗</span><span className="stat-caption">این ماه</span></div><p>فروش کل</p><h2>۲۴,۸۵۰,۰۰۰ <small>تومان</small></h2><div className="stat-footer"><span className="trend">↗ ۱۲.۸٪</span><span>نسبت به ماه قبل</span></div></article>
              <article className="stat-card"><div className="stat-top"><span className="stat-icon">▧</span><span className="stat-caption">این ماه</span></div><p>سفارش‌ها</p><h2>۱۲۸</h2><div className="stat-footer"><span>در این ماه</span></div></article>
              <article className="stat-card"><div className="stat-top"><span className="stat-icon">♙</span><span className="stat-caption">مجموع</span></div><p>مشتریان</p><h2>۸۶۴</h2><div className="stat-footer"><span>مشتری ثبت‌شده</span></div></article>
              <article className="stat-card"><div className="stat-top"><span className="stat-icon">▤</span><span className="stat-caption">موجودی</span></div><p>تعداد کالاها</p><h2>{new Intl.NumberFormat("fa-IR").format(totalStock)}</h2><div className="stat-footer"><span>{products.length} محصول در فهرست</span></div></article>
            </section>
            <section className="panel chart-panel">
              <div className="panel-heading"><div><h3>روند فروش ماهانه</h3><p>مقادیر نسبی فروش در ۱۲ ماه اخیر</p></div></div>
              <div className="chart-summary"><strong>۲۴,۸۵۰,۰۰۰ <small>تومان</small></strong><span className="chart-growth">↗ ۱۲.۸٪</span></div>
              <div className="chart">
                <div className="chart-grid-lines"><span>۱۰۰</span><span>۷۵</span><span>۵۰</span><span>۲۵</span><span>۰</span></div>
                <div className="chart-bars">
                  {sales.map((value, index) => <div className="bar-column" key={index}><div className={`bar ${index === 11 ? "bar-highlight" : ""}`} style={{ height: `${value}%` }} title={`مقدار نسبی فروش: ${value}`} /></div>)}
                </div>
              </div>
              <div className="chart-months">{["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"].map((month) => <span key={month}>{month}</span>)}</div>
            </section>
            <p className="report-note">توجه: اعداد این بخش برای نمایش رابط کاربری هستند و داده‌ی واقعی فروشگاه نیستند.</p>
          </section>
        )}

        <footer className="footer">
          <span>ساخته‌شده با دقت و کمی قهوه ☕</span>
          <span>nude studio © ۱۴۰۵</span>
        </footer>
      </main>
    </div>
  );
}

export default App;