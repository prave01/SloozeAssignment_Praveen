import { useDebounce } from '@/client/hooks'
import {
  useAvailableItems,
  useSelectItemsCard,
} from '@/client/store/Menu/store'
import { CustomSelectCard } from '@/components/custom/atoms/CustomSelectCard'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AddItemsByMenu,
  GetItemsByQuery,
  GetMenuItems,
} from '@/server/serverFn'
import { RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ShowAvailableItems({
  restaurant,
  menuId,
}: {
  restaurant: 'america' | 'india'
  menuId?: string
}) {
  // this is for storing the available items from db
  const items = useAvailableItems((s) => s.availableItems)
  const addItems = useAvailableItems((s) => s.addItems)
  const filterItems = useAvailableItems((s) => s.filterItems)
  const clear = useAvailableItems((s) => s.clear)

  // this is for selecting the card
  const selectedItems = useSelectItemsCard((s) => s.selectedItems)
  const setItems = useSelectItemsCard((s) => s.addSelectedItem)
  const removeItem = useSelectItemsCard((s) => s.removeItem)

  const [loading, setLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)

  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleAddItems = async () => {
    try {
      if (selectedItems.size < 1) {
        toast.error('Please selelct atleast one to proceed')
        return
      }
      setAddLoading(true)
      const addedItem = await AddItemsByMenu(selectedItems)

      filterItems(addedItem)
      removeItem(addedItem)

      toast.success('Items inserted successfully')
    } catch (err: any) {
      toast.error('Somthing went wrong', { description: `${err}` })
    } finally {
      setAddLoading(false)
    }
  }

  useEffect(() => {
    if (!menuId) return
      ; (async () => {
        setLoading(true)
        try {
          clear()

          const [allItems, menuItems] = await Promise.all([
            GetItemsByQuery(restaurant, debouncedSearch),
            GetMenuItems(menuId),
          ])

          const menuItemIds = new Set(menuItems.map((item) => item.itemId))

          const availableItems = allItems.filter(
            (item) => !menuItemIds.has(item.id)
          )

          addItems(availableItems)
        } finally {
          setLoading(false)
        }
      })()
  }, [menuId, debouncedSearch, restaurant, refreshKey])

  return (
    <div
      className="group w-1/3 flex flex-col gap-2 h-full min-h-0
        focus:outline-none"
    >
      <CardTitle
        className="border border-myborder py-1 px-3 text-lg transition-all
          duration-200 group-focus-within:border-blue-500/40 flex-shrink-0"
      >
        Available Items
      </CardTitle>

      <div
        className="w-full bg-transparent border p-3 border-myborder
          transition-all duration-200 group-focus-within:border-blue-500/40
          flex-1 min-h-0 overflow-hidden relative flex flex-col"
      >
        {loading && (
          <div
            className="absolute flex-col gap-1 w-full h-full flex items-center
              justify-center backdrop-blur-md z-10"
          >
            {' '}
            <Spinner className="size-6" />
            <span className="text-neutral-500 text-md">Fetching Items</span>
          </div>
        )}
        <div
          className="w-full flex h-auto items-center justify-between
            flex-shrink-0 mb-2"
        >
          {' '}
          <div className="text-neutral-500 text-sm">
            Selected Items -
            <span className="text-primary"> {selectedItems.size}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {' '}
            <Button
              onClick={handleRefresh}
              className="bg-transparent hover:bg-accent"
            >
              <RefreshCcw className="text-muted-foreground" />
            </Button>
            <Button onClick={handleAddItems}>
              {addLoading ? <Spinner className="size-5" /> : 'Add Items'}
            </Button>
          </div>
        </div>

        <div className="w-full flex-shrink-0 mb-2">
          <input
            value={searchInput}
            placeholder="Find Items by Name"
            onChange={(e) => {
              e.preventDefault()
              setSearchInput(e.target.value)
            }}
            className={`rounded-none placeholder:text-xs text-sm w-full
              placeholder:pl-1 placeholder:italic focus:outline-none
              focus:bg-zinc-500/20 border border-myborder px-2 py-2`}
          />
        </div>

        <div className="h-[520px]  no-scrollbar w-full overflow-y-scroll">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {items.map((item, index) => (
              <CustomSelectCard
                key={item.id ?? `${item.name}-${item.location}-${index}`}
                name={item.name}
                type="menu"
                cost={item.cost}
                menuId={menuId as string}
                location={item.location}
                id={item.id}
                elapsedTime={item.elapsedTime}
                image={item.image ?? undefined}
                setCardItem={setItems}
                selectedItems={selectedItems}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
