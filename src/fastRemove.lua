local fr = {}

function fr.fastRemove(list, index)
    local temp

    for i = index, #list-1 do
        temp = list[i]
        list[i] = list[i+1]
        list[i+1] = temp
    end
    
    temp = list[#list]

    list[#list] = nil

    return temp
end

return fr