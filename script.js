let parkedVehicles = JSON.parse(localStorage.getItem("parkedVehicles")) || [];
let history = JSON.parse(localStorage.getItem("parkingHistory")) || [];
let revenue = Number(localStorage.getItem("revenue")) || 0;

const table = document.getElementById("vehicleTable");
const historyTable = document.getElementById("historyTable");
const parkingGrid = document.getElementById("parkingGrid");

const totalSlots = 15;

createParkingGrid();
renderVehicles();
renderHistory();
updateDashboard();

document.getElementById("parkBtn").addEventListener("click", parkVehicle);

document.getElementById("searchInput").addEventListener("keyup", searchVehicle);

function createParkingGrid(){

    parkingGrid.innerHTML="";

    for(let i=1;i<=totalSlots;i++){

        let slotName;

        if(i<=5){
            slotName="A"+i;
        }
        else if(i<=10){
            slotName="B"+(i-5);
        }
        else{
            slotName="C"+(i-10);
        }

        const div=document.createElement("div");

        div.className="slot available";

        div.id=slotName;

        div.innerHTML=slotName;

        parkingGrid.appendChild(div);

    }

}

function parkVehicle(){

    const number=document.getElementById("vehicleNumber").value.trim();

    const owner=document.getElementById("ownerName").value.trim();

    const type=document.getElementById("vehicleType").value;

    const slot=document.getElementById("slot").value;

    if(number===""||owner===""){

        alert("Fill all fields");

        return;

    }

    if(parkedVehicles.find(v=>v.slot===slot)){

        alert("Slot already occupied!");

        return;

    }

    if(parkedVehicles.find(v=>v.number===number)){

        alert("Vehicle already parked!");

        return;

    }

    const vehicle={

        number,

        owner,

        type,

        slot,

        arrival:new Date().toLocaleTimeString(),

        arrivalTime:Date.now()

    };

    parkedVehicles.push(vehicle);

    saveData();

    renderVehicles();

    updateDashboard();

    clearInputs();

}

function renderVehicles(){

    table.innerHTML="";

    createParkingGrid();

    parkedVehicles.forEach((v,index)=>{

        const badge=v.type.toLowerCase();

        table.innerHTML+=`

        <tr>

        <td>${v.number}</td>

        <td>${v.owner}</td>

        <td>

        <span class="badge ${badge}">

        ${v.type}

        </span>

        </td>

        <td>${v.slot}</td>

        <td>${v.arrival}</td>

        <td>--</td>

        <td>

        <button class="exitBtn"

        onclick="exitVehicle(${index})">

        Exit

        </button>

        </td>

        </tr>

        `;

        const slot=document.getElementById(v.slot);

        if(slot){

            slot.classList.remove("available");

            slot.classList.add("occupied");

            slot.innerHTML=v.slot+"<br>🚗";

        }

    });

}

function exitVehicle(index){

    const vehicle=parkedVehicles[index];

    const exitTime=Date.now();

    const hours=Math.max(1,Math.ceil((exitTime-vehicle.arrivalTime)/3600000));

    const fee=100+(hours*50);

    revenue+=fee;

    history.unshift({

        number:vehicle.number,

        slot:vehicle.slot,

        arrival:vehicle.arrival,

        exit:new Date().toLocaleTimeString(),

        fee:fee

    });

    parkedVehicles.splice(index,1);

    saveData();

    renderVehicles();

    renderHistory();

    updateDashboard();

}

function renderHistory(){

    historyTable.innerHTML="";

    history.forEach(item=>{

        historyTable.innerHTML+=`

        <tr>

        <td>${item.number}</td>

        <td>${item.slot}</td>

        <td>${item.arrival}</td>

        <td>${item.exit}</td>

        <td>Rs.${item.fee}</td>

        </tr>

        `;

    });

}

function updateDashboard(){

    document.getElementById("occupiedSlots").innerText=parkedVehicles.length;

    document.getElementById("availableSlots").innerText=totalSlots-parkedVehicles.length;

    document.getElementById("vehicleCount").innerText=parkedVehicles.length;

    document.getElementById("todayRevenue").innerText="Rs."+revenue;

}

function searchVehicle(){

    const value=document.getElementById("searchInput").value.toLowerCase();

    const rows=table.getElementsByTagName("tr");

    for(let i=0;i<rows.length;i++){

        const text=rows[i].innerText.toLowerCase();

        rows[i].style.display=text.includes(value)?"":"none";

    }

}

function clearInputs(){

    document.getElementById("vehicleNumber").value="";

    document.getElementById("ownerName").value="";

    document.getElementById("vehicleType").selectedIndex=0;

    document.getElementById("slot").selectedIndex=0;

}

function saveData(){

    localStorage.setItem(

        "parkedVehicles",

        JSON.stringify(parkedVehicles)

    );

    localStorage.setItem(

        "parkingHistory",

        JSON.stringify(history)

    );

    localStorage.setItem(

        "revenue",

        revenue

    );

}