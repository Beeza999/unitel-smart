import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils';

const deliveryMap = {
  pickup: 'PICKUP',
  delivery: 'HOME_DELIVERY',
  esim: 'ESIM_EMAIL'
};

const paymentMap = {
  cod: 'COD',
  bank: 'BANK_TRANSFER',
  qr: 'QR_PAYMENT',
  store: 'PAY_AT_STORE'
};

function prepareOrderItem(item) {
  if (item.itemType === 'ESIM') {
    return {
      itemType: 'ESIM',
      planId: item.planId
    };
  }

  return {
    itemType: item.itemType,
    id: item.id
  };
}

export default function Checkout() {
  const { cart, saveCart, notify, user } = useApp();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);

  const submit = async e => {
    e.preventDefault();

    if (!cart.length) {
      notify('ກະຕ່າວ່າງ');
      return;
    }

    if (!customer.name.trim()) {
      notify('ກະລຸນາປ້ອນຊື່');
      return;
    }

    if (!customer.phone.trim()) {
      notify('ກະລຸນາປ້ອນເບີໂທ');
      return;
    }

    try {
      const items = cart.map(prepareOrderItem);

      const { data } = await api.post('/orders', {
        customerName: customer.name.trim(),
        customerPhone: customer.phone.trim(),
        address: customer.address.trim(),
        deliveryType: deliveryMap[deliveryMethod],
        paymentType: paymentMap[paymentMethod],
        items
      });

      saveCart([]);
      notify('ສັ່ງຊື້ສຳເລັດ');

      navigate('/success', {
        state: {
          orderNo: data.code
        }
      });
    } catch (err) {
      notify(err?.response?.data?.message || 'ສັ່ງຊື້ບໍ່ສຳເລັດ');
    }
  };

  return (
    <section className="px-4 py-12">
      <form onSubmit={submit} className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl font-black">ຊຳລະເງິນ</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card p-6">
            <h2 className="font-display text-xl font-black">
              ຂໍ້ມູນລູກຄ້າ
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                className="input"
                placeholder="ຊື່ເຕັມ"
                value={customer.name}
                onChange={e =>
                  setCustomer({
                    ...customer,
                    name: e.target.value
                  })
                }
                required
              />

              <input
                className="input"
                placeholder="ເບີໂທ"
                value={customer.phone}
                onChange={e =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value
                  })
                }
                required
              />

              <input
                className="input md:col-span-2"
                placeholder="Email"
                value={customer.email}
                onChange={e =>
                  setCustomer({
                    ...customer,
                    email: e.target.value
                  })
                }
              />

              <input
                className="input md:col-span-2"
                placeholder="ທີ່ຢູ່ຈັດສົ່ງ"
                value={customer.address}
                onChange={e =>
                  setCustomer({
                    ...customer,
                    address: e.target.value
                  })
                }
              />
            </div>

            <h2 className="mt-8 font-display text-xl font-black">
              Delivery
            </h2>

            <select
              className="input mt-3"
              value={deliveryMethod}
              onChange={e => setDeliveryMethod(e.target.value)}
            >
              <option value="pickup">Pick up at Store</option>
              <option value="delivery">Home Delivery</option>
              <option value="esim">eSIM by Email</option>
            </select>

            <h2 className="mt-8 font-display text-xl font-black">
              Payment
            </h2>

            <select
              className="input mt-3"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="bank">Bank Transfer</option>
              <option value="qr">QR Payment</option>
              <option value="store">Pay at Store</option>
            </select>

            <button
              className="btn btn-red mt-8 px-8 py-3"
              disabled={!cart.length}
            >
              Place Order
            </button>
          </div>

          <aside className="card h-fit p-6">
            <h2 className="font-display text-xl font-black">
              Summary
            </h2>

            {cart.map((item, idx) => (
              <div className="mt-4 flex justify-between text-sm" key={idx}>
                <span>{item.name}</span>
                <b>{fmt(item.price)}</b>
              </div>
            ))}

            <div className="mt-5 flex justify-between border-t pt-4">
              <b>Total</b>
              <b className="font-display text-2xl text-unitel-red">
                {fmt(total)}
              </b>
            </div>
          </aside>
        </div>
      </form>
    </section>
  );
}