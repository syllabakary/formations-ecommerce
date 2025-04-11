import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold">Panier</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Votre panier est vide
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-600">
                      {item.quantity} x {item.price}€
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">{state.total.toFixed(2)}€</span>
            </div>
            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
              Procéder au paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;